'use strict';

const crypto = require('crypto');
const { db } = require('../../config/database');
const env = require('../../config/env');
const { createImageProvider } = require('./providers/providerFactory');
const { ImageStorageService } = require('./imageStorageService');
const { buildPrompt } = require('./promptBuilder');
const { JOB_STATUS, PROVIDER_ERROR_CODES, SAFE_ERROR_MESSAGES, ImageProviderError, normalizeProviderError } = require('./types');

class AiImageServiceError extends Error {
  constructor(code, message, status = 400, details = {}) {
    super(message); this.code = code; this.status = status; Object.assign(this, details);
  }
}

class AiImageService {
  constructor(options = {}) {
    this.db = options.db || db;
    this.providerName = options.providerName || env.IMAGE_PROVIDER;
    this.provider = options.provider || createImageProvider();
    this.storage = options.storage || new ImageStorageService();
    this.now = options.now || (() => new Date());
    this.limits = {
      perUser: positiveInt(env.AI_IMAGE_DAILY_LIMIT_PER_USER, 5),
      global: positiveInt(env.AI_IMAGE_DAILY_LIMIT_GLOBAL, 50),
      concurrent: positiveInt(env.AI_IMAGE_MAX_CONCURRENT_PER_USER, 1),
      cooldownSeconds: positiveInt(env.AI_IMAGE_COOLDOWN_SECONDS, 30),
      ...options.limits,
    };
  }

  async createJob({ userId, idempotencyKey, input }) {
    if (!env.AI_IMAGE_GENERATION_ENABLED) throw new AiImageServiceError('GENERATION_DISABLED', 'Tính năng tạo ảnh đang tạm dừng.', 503);
    const existing = this.db.prepare('SELECT id FROM ai_image_jobs WHERE user_id = ? AND idempotency_key = ?').get(userId, idempotencyKey);
    if (existing) return { job: this.getOwnedJob(existing.id, userId), reused: true };
    this.assertProjectOwnership(input.projectId, userId);
    this.assertSlideOwnership(input.slideId, input.projectId, userId);
    if (String(this.providerName).toLowerCase() !== 'fake') this.assertQuota(userId);

    const now = this.now();
    const id = `job_${crypto.randomUUID()}`;
    const { optimizedPrompt, appliedRules } = buildPrompt(input);
    const options = { subject: input.subject, gradeLevel: input.gradeLevel, imageType: input.imageType, style: input.style, aspectRatio: input.aspectRatio };
    this.db.prepare(`INSERT INTO ai_image_jobs
      (id,user_id,project_id,slide_id,idempotency_key,source_prompt,optimized_prompt,options_json,applied_rules_json,provider,model,status,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      id, userId, input.projectId || null, input.slideId || null, idempotencyKey, input.description,
      optimizedPrompt, JSON.stringify(options), JSON.stringify(appliedRules), this.providerName,
      env.IMAGE_MODEL, JOB_STATUS.QUEUED, now.toISOString(),
    );
    this.db.prepare('UPDATE ai_image_jobs SET status = ? WHERE id = ?').run(JOB_STATUS.PROCESSING, id);
    try {
      const result = await this.provider.generate({ prompt: optimizedPrompt, aspectRatio: input.aspectRatio });
      await this.applyProviderResult(id, userId, result);
    } catch (error) {
      this.failJob(id, normalizeProviderError(error));
    }
    return { job: this.getOwnedJob(id, userId), reused: false };
  }

  async getJob(jobId, userId) {
    let job = this.getOwnedJob(jobId, userId);
    if ([JOB_STATUS.QUEUED, JOB_STATUS.PROCESSING].includes(job.status) && job.externalJobId) {
      try {
        const result = await this.provider.getStatus(job.externalJobId);
        await this.applyProviderResult(jobId, userId, result);
      } catch (error) {
        this.failJob(jobId, normalizeProviderError(error));
      }
      job = this.getOwnedJob(jobId, userId);
    }
    return job;
  }

  async applyProviderResult(jobId, userId, result) {
    if (!result || !Object.values(JOB_STATUS).includes(result.status)) {
      this.failJob(jobId, new ImageProviderError(PROVIDER_ERROR_CODES.INVALID_RESPONSE));
      return;
    }
    if (result.externalJobId) this.db.prepare('UPDATE ai_image_jobs SET external_job_id = ? WHERE id = ?').run(result.externalJobId, jobId);
    if (result.status === JOB_STATUS.COMPLETED && result.image) {
      const stored = await this.storage.store(result.image, { userId, jobId });
      const completedAt = this.now().toISOString();
      this.db.transaction(() => {
        this.db.prepare(`INSERT OR IGNORE INTO generated_images
          (id,job_id,user_id,storage_key,storage_url,width,height,mime_type,provider,model,created_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
          result.image.id, jobId, userId, stored.storageKey, stored.storageUrl, result.image.width,
          result.image.height, result.image.mimeType, result.image.provider, result.image.model, completedAt,
        );
        this.db.prepare('UPDATE ai_image_jobs SET status = ?, provider = ?, model = ?, completed_at = ? WHERE id = ?')
          .run(JOB_STATUS.COMPLETED, result.image.provider, result.image.model, completedAt, jobId);
      })();
    } else if (result.status === JOB_STATUS.COMPLETED) {
      this.failJob(jobId, new ImageProviderError(PROVIDER_ERROR_CODES.INVALID_RESPONSE));
    } else if (result.status === JOB_STATUS.FAILED) {
      this.failJob(jobId, providerResultError(result.error));
    } else {
      this.db.prepare('UPDATE ai_image_jobs SET status = ? WHERE id = ?').run(result.status || JOB_STATUS.PROCESSING, jobId);
    }
  }

  failJob(jobId, error) {
    this.db.prepare('UPDATE ai_image_jobs SET status = ?, error_code = ?, completed_at = ? WHERE id = ?')
      .run(JOB_STATUS.FAILED, error.code, this.now().toISOString(), jobId);
  }

  getOwnedJob(jobId, userId) {
    const row = this.db.prepare(`SELECT j.*, i.id image_id, i.storage_url, i.width, i.height, i.mime_type,
      i.provider image_provider, i.model image_model FROM ai_image_jobs j
      LEFT JOIN generated_images i ON i.job_id = j.id WHERE j.id = ?`).get(jobId);
    if (!row) throw new AiImageServiceError('JOB_NOT_FOUND', 'Không tìm thấy tác vụ.', 404);
    if (row.user_id !== userId) throw new AiImageServiceError('FORBIDDEN', 'Bạn không có quyền truy cập tác vụ này.', 403);
    return mapJob(row);
  }

  assertProjectOwnership(projectId, userId) {
    if (!projectId) return;
    const project = this.db.prepare('SELECT id FROM projects WHERE id = ? AND owner_id = ? AND is_deleted = 0').get(projectId, userId);
    if (!project) throw new AiImageServiceError('FORBIDDEN', 'Project không tồn tại hoặc không thuộc người dùng.', 403);
  }

  assertSlideOwnership(slideId, projectId, userId) {
    if (!slideId) return;
    const slide = this.db.prepare(`SELECT s.id, s.project_id FROM slides s
      JOIN projects p ON p.id = s.project_id
      WHERE s.id = ? AND p.owner_id = ? AND p.is_deleted = 0`).get(slideId, userId);
    if (!slide || (projectId && slide.project_id !== projectId)) {
      throw new AiImageServiceError('FORBIDDEN', 'Slide is not owned by the user or does not belong to the selected project.', 403);
    }
  }

  assertQuota(userId) {
    const { start, end } = hoChiMinhDayBounds(this.now());
    const countSql = "SELECT COUNT(*) count FROM ai_image_jobs WHERE created_at >= ? AND created_at < ?";
    const userCount = this.db.prepare(`${countSql} AND user_id = ?`).get(start, end, userId).count;
    const globalCount = this.db.prepare(countSql).get(start, end).count;
    if (userCount >= this.limits.perUser || globalCount >= this.limits.global) {
      throw new AiImageServiceError('DAILY_QUOTA_EXCEEDED', 'Đã sử dụng hết lượt tạo ảnh hôm nay.', 429, { retryAfter: end });
    }
    const active = this.db.prepare("SELECT COUNT(*) count FROM ai_image_jobs WHERE user_id = ? AND status IN ('queued','processing')").get(userId).count;
    if (active >= this.limits.concurrent) throw new AiImageServiceError('JOB_CONFLICT', 'Một tác vụ tạo ảnh khác đang chạy.', 409);
    const latest = this.db.prepare('SELECT created_at FROM ai_image_jobs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
    if (latest && this.now().getTime() - Date.parse(latest.created_at) < this.limits.cooldownSeconds * 1000) {
      throw new AiImageServiceError('RATE_LIMITED', `Vui lòng chờ ${this.limits.cooldownSeconds} giây trước khi tạo ảnh tiếp theo.`, 429);
    }
  }
}

function mapJob(row) {
  const error = row.error_code ? { code: row.error_code, message: SAFE_ERROR_MESSAGES[row.error_code] || SAFE_ERROR_MESSAGES[PROVIDER_ERROR_CODES.UNAVAILABLE] } : null;
  return { jobId: row.id, status: row.status, optimizedPrompt: row.optimized_prompt, appliedRules: JSON.parse(row.applied_rules_json), createdAt: row.created_at, completedAt: row.completed_at, externalJobId: row.external_job_id, image: row.image_id ? { id: row.image_id, url: row.storage_url, width: row.width, height: row.height, mimeType: row.mime_type, provider: row.image_provider, model: row.image_model } : null, error };
}

function hoChiMinhDayBounds(now) {
  const shifted = new Date(now.getTime() + 7 * 3600000);
  const day = shifted.toISOString().slice(0, 10);
  const startMs = Date.parse(`${day}T00:00:00.000Z`) - 7 * 3600000;
  return { start: new Date(startMs).toISOString(), end: new Date(startMs + 86400000).toISOString() };
}
function positiveInt(value, fallback) { const parsed = Number.parseInt(value, 10); return parsed > 0 ? parsed : fallback; }
function providerResultError(error) {
  if (error instanceof Error) return normalizeProviderError(error);
  if (error && Object.values(PROVIDER_ERROR_CODES).includes(error.code)) return new ImageProviderError(error.code);
  return new ImageProviderError(PROVIDER_ERROR_CODES.UNAVAILABLE);
}

module.exports = { AiImageService, AiImageServiceError, hoChiMinhDayBounds };

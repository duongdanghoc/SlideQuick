'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');
const { AiImageService, AiImageServiceError, hoChiMinhDayBounds } = require('../../../src/features/ai-image/aiImageService');

function setup(overrides = {}) {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE users (id TEXT PRIMARY KEY);
    CREATE TABLE projects (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, is_deleted INTEGER DEFAULT 0);
    CREATE TABLE slides (id TEXT PRIMARY KEY, project_id TEXT NOT NULL);
    CREATE TABLE ai_image_jobs (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,project_id TEXT,slide_id TEXT,idempotency_key TEXT NOT NULL,source_prompt TEXT NOT NULL,optimized_prompt TEXT NOT NULL,options_json TEXT NOT NULL,applied_rules_json TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,external_job_id TEXT,status TEXT NOT NULL,error_code TEXT,created_at TEXT NOT NULL,completed_at TEXT,UNIQUE(user_id,idempotency_key));
    CREATE TABLE generated_images (id TEXT PRIMARY KEY,job_id TEXT NOT NULL UNIQUE,user_id TEXT NOT NULL,storage_key TEXT,storage_url TEXT NOT NULL,width INTEGER NOT NULL,height INTEGER NOT NULL,mime_type TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,created_at TEXT NOT NULL);
    INSERT INTO users VALUES ('u1'), ('u2');
    INSERT INTO projects VALUES ('p1','u1',0);
  `);
  let calls = 0;
  const provider = overrides.provider || { generate: async () => { calls++; return { status: 'completed', image: { id: 'img1', url: '/fixture.svg', width: 1280, height: 720, mimeType: 'image/svg+xml', provider: 'fake', model: 'test' } }; } };
  const storage = { store: async (image) => ({ storageKey: null, storageUrl: image.url }) };
  const service = new AiImageService({ db, provider, storage, providerName: overrides.providerName || 'fake', now: overrides.now, limits: overrides.limits });
  return { db, service, calls: () => calls };
}

const input = { description: 'Minh họa một thí nghiệm vật lý đơn giản', subject: 'physics', gradeLevel: 'secondary', imageType: 'experiment', style: 'clean_diagram', aspectRatio: '16:9', projectId: 'p1' };

test('creates a completed owned job and reuses its idempotency key', async () => {
  const ctx = setup();
  const first = await ctx.service.createJob({ userId: 'u1', idempotencyKey: 'same', input });
  const second = await ctx.service.createJob({ userId: 'u1', idempotencyKey: 'same', input });
  assert.equal(first.job.status, 'completed');
  assert.equal(first.job.image.url, '/fixture.svg');
  assert.equal(second.job.jobId, first.job.jobId);
  assert.equal(second.reused, true);
  assert.equal(ctx.calls(), 1);
});

test('does not expose another user job', async () => {
  const ctx = setup();
  const result = await ctx.service.createJob({ userId: 'u1', idempotencyKey: 'owned', input });
  await assert.rejects(() => ctx.service.getJob(result.job.jobId, 'u2'), (error) => error instanceof AiImageServiceError && error.code === 'FORBIDDEN');
});

test('enforces paid-provider daily quota', async () => {
  const now = new Date('2026-09-22T05:00:00.000Z');
  const ctx = setup({ providerName: 'gemini', now: () => now, limits: { perUser: 1, global: 50, concurrent: 1, cooldownSeconds: 30 } });
  await ctx.service.createJob({ userId: 'u1', idempotencyKey: 'one', input });
  await assert.rejects(() => ctx.service.createJob({ userId: 'u1', idempotencyKey: 'two', input }), (error) => error.code === 'DAILY_QUOTA_EXCEEDED' && error.status === 429);
});

test('rejects a slide outside the selected owned project', async () => {
  const ctx = setup();
  ctx.db.prepare("INSERT INTO projects VALUES ('p2','u1',0)").run();
  ctx.db.prepare("INSERT INTO slides VALUES ('s2','p2')").run();
  await assert.rejects(
    () => ctx.service.createJob({ userId: 'u1', idempotencyKey: 'slide-check', input: { ...input, slideId: 's2' } }),
    (error) => error.code === 'FORBIDDEN',
  );
});

test('normalizes a malformed completed provider result to a failed job', async () => {
  const ctx = setup({ provider: { generate: async () => ({ status: 'completed' }) } });
  const result = await ctx.service.createJob({ userId: 'u1', idempotencyKey: 'bad-result', input });
  assert.equal(result.job.status, 'failed');
  assert.equal(result.job.error.code, 'PROVIDER_INVALID_RESPONSE');
});

test('calculates demo-day bounds in Asia/Ho_Chi_Minh', () => {
  assert.deepEqual(hoChiMinhDayBounds(new Date('2026-09-22T18:00:00.000Z')), {
    start: '2026-09-22T17:00:00.000Z', end: '2026-09-23T17:00:00.000Z',
  });
});

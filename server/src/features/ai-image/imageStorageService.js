'use strict';

const fs = require('fs/promises');
const path = require('path');
const env = require('../../config/env');

class ImageStorageService {
  constructor(options = {}) {
    this.mode = options.mode || env.AI_IMAGE_STORAGE;
    this.supabaseUrl = options.supabaseUrl || env.SUPABASE_URL;
    this.serviceKey = options.serviceKey || env.SUPABASE_SERVICE_ROLE_KEY;
    this.bucket = options.bucket || env.SUPABASE_STORAGE_BUCKET;
    this.fetch = options.fetch || globalThis.fetch;
    this.localRoot = options.localRoot || path.join(__dirname, '../../../uploads/ai');
  }

  async store(providerImage, { userId, jobId }) {
    if (!providerImage.url.startsWith('data:')) {
      return { storageKey: null, storageUrl: providerImage.url };
    }
    const parsed = parseDataUrl(providerImage.url);
    const extension = mimeExtension(parsed.mimeType);
    const storageKey = `ai-images/${userId}/${jobId}/${providerImage.id}.${extension}`;
    if (this.mode === 'supabase') {
      if (!this.supabaseUrl || !this.serviceKey) throw new Error('Supabase backend storage is not configured');
      const response = await this.fetch(
        `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${storageKey}`,
        { method: 'POST', headers: { Authorization: `Bearer ${this.serviceKey}`, apikey: this.serviceKey, 'Content-Type': parsed.mimeType, 'x-upsert': 'false' }, body: parsed.buffer },
      );
      if (!response.ok) throw new Error(`Image storage failed with status ${response.status}`);
      return {
        storageKey,
        storageUrl: `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${storageKey}`,
      };
    }
    const relativeName = `${jobId}-${providerImage.id}.${extension}`;
    await fs.mkdir(this.localRoot, { recursive: true });
    await fs.writeFile(path.join(this.localRoot, relativeName), parsed.buffer);
    return { storageKey: relativeName, storageUrl: `/uploads/ai/${relativeName}` };
  }
}

function parseDataUrl(value) {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(value);
  if (!match) throw new Error('Provider returned an invalid image data URL');
  return { mimeType: match[1], buffer: Buffer.from(match[2], 'base64') };
}

function mimeExtension(mimeType) {
  return { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg' }[mimeType] || 'png';
}

module.exports = { ImageStorageService, parseDataUrl };

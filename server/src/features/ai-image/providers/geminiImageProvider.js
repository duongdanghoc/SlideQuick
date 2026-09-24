'use strict';

const crypto = require('crypto');
const ImageProvider = require('./imageProvider');
const {
  ASPECT_RATIOS,
  JOB_STATUS,
  PROVIDER_ERROR_CODES,
  ImageProviderError,
} = require('../types');

const DEFAULT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const DEFAULT_MODEL = 'gemini-3.1-flash-image';
const SUPPORTED_IMAGE_SIZES = Object.freeze(['512', '1K', '2K', '4K']);
const DIMENSIONS_1K = Object.freeze({
  '1:1': [1024, 1024],
  '4:3': [1200, 896],
  '16:9': [1376, 768],
  '3:4': [896, 1200],
});

class GeminiImageProvider extends ImageProvider {
  constructor(options = {}) {
    super();
    this.apiKey = options.apiKey;
    this.model = options.model || DEFAULT_MODEL;
    this.imageSize = options.imageSize || '1K';
    this.timeoutMs = parsePositiveInteger(options.timeoutMs, 60000);
    this.endpoint = options.endpoint || DEFAULT_ENDPOINT;
    this.fetch = options.fetch || globalThis.fetch;

    if (!this.apiKey) throw new Error('GEMINI_API_KEY is required when IMAGE_PROVIDER=gemini');
    if (!SUPPORTED_IMAGE_SIZES.includes(this.imageSize)) {
      throw new Error(
        `Invalid GEMINI_IMAGE_SIZE "${this.imageSize}". Supported values: ${SUPPORTED_IMAGE_SIZES.join(', ')}`,
      );
    }
    if (typeof this.fetch !== 'function') {
      throw new Error('A fetch implementation is required for GeminiImageProvider');
    }
  }

  async generate({ prompt, aspectRatio }) {
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      throw new TypeError('prompt must be a non-empty string');
    }
    if (!ASPECT_RATIOS.includes(aspectRatio)) {
      throw new TypeError(`Unsupported aspect ratio: ${aspectRatio}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          model: this.model,
          input: prompt.trim(),
          response_format: {
            type: 'image',
            mime_type: 'image/png',
            aspect_ratio: aspectRatio,
            image_size: this.imageSize,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const code = response.status >= 400 && response.status < 500 && response.status !== 429
          ? PROVIDER_ERROR_CODES.REJECTED
          : PROVIDER_ERROR_CODES.UNAVAILABLE;
        throw new ImageProviderError(code, { cause: { status: response.status } });
      }

      const payload = await response.json();
      const image = findImageBlock(payload);
      if (!image) {
        throw new ImageProviderError(PROVIDER_ERROR_CODES.INVALID_RESPONSE);
      }

      const mimeType = image.mime_type || image.mimeType || 'image/png';
      const [baseWidth, baseHeight] = DIMENSIONS_1K[aspectRatio];
      const scale = imageSizeScale(this.imageSize);
      const externalJobId = payload.id || payload.interaction?.id
        || `gemini_${crypto.randomUUID()}`;

      return {
        externalJobId,
        status: JOB_STATUS.COMPLETED,
        image: {
          id: `gemini_img_${crypto.randomUUID()}`,
          url: `data:${mimeType};base64,${image.data}`,
          width: Math.round(baseWidth * scale),
          height: Math.round(baseHeight * scale),
          mimeType,
          provider: 'gemini',
          model: this.model,
        },
      };
    } catch (error) {
      if (error instanceof ImageProviderError) throw error;
      throw new ImageProviderError(PROVIDER_ERROR_CODES.UNAVAILABLE, { cause: error });
    } finally {
      clearTimeout(timeout);
    }
  }

  async getStatus() {
    throw new ImageProviderError(PROVIDER_ERROR_CODES.INVALID_RESPONSE);
  }
}

function findImageBlock(value) {
  if (!value || typeof value !== 'object') return null;
  if (value.type === 'image' && typeof value.data === 'string' && value.data.length > 0) {
    return value;
  }
  if (value.output_image && typeof value.output_image.data === 'string') {
    return value.output_image;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      for (const item of child) {
        const found = findImageBlock(item);
        if (found) return found;
      }
    } else {
      const found = findImageBlock(child);
      if (found) return found;
    }
  }
  return null;
}

function imageSizeScale(imageSize) {
  return { '512': 0.5, '1K': 1, '2K': 2, '4K': 4 }[imageSize];
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

module.exports = GeminiImageProvider;
module.exports.DEFAULT_MODEL = DEFAULT_MODEL;
module.exports.SUPPORTED_IMAGE_SIZES = SUPPORTED_IMAGE_SIZES;


'use strict';

const crypto = require('crypto');
const ImageProvider = require('./imageProvider');
const {
  ASPECT_RATIOS,
  JOB_STATUS,
  PROVIDER_ERROR_CODES,
  ImageProviderError,
} = require('../types');

const DIMENSIONS = Object.freeze({
  '1:1': [1024, 1024],
  '4:3': [1200, 900],
  '16:9': [1280, 720],
  '3:4': [900, 1200],
});
const FIXTURES = Object.freeze({
  '1:1': '/ai-image-fixtures/eduart-placeholder-1x1.svg',
  '4:3': '/ai-image-fixtures/eduart-placeholder-4x3.svg',
  '16:9': '/ai-image-fixtures/eduart-placeholder.svg',
  '3:4': '/ai-image-fixtures/eduart-placeholder-3x4.svg',
});
const SUPPORTED_FAKE_MODES = Object.freeze(['success', 'async', 'failure']);

class FakeImageProvider extends ImageProvider {
  constructor(options = {}) {
    super();
    this.mode = options.mode || 'success';
    if (!SUPPORTED_FAKE_MODES.includes(this.mode)) {
      throw new Error(
        `Invalid FAKE_IMAGE_PROVIDER_MODE "${this.mode}". Supported values: ${SUPPORTED_FAKE_MODES.join(', ')}`,
      );
    }
    this.jobs = new Map();
  }

  async generate({ prompt, aspectRatio }) {
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      throw new TypeError('prompt must be a non-empty string');
    }
    if (!ASPECT_RATIOS.includes(aspectRatio)) {
      throw new TypeError(`Unsupported aspect ratio: ${aspectRatio}`);
    }
    if (this.mode === 'failure') {
      throw new ImageProviderError(PROVIDER_ERROR_CODES.UNAVAILABLE, {
        cause: { apiKey: 'must-not-leak', providerPayload: 'fake diagnostic' },
      });
    }

    const externalJobId = `fake_job_${digest(`${prompt}|${aspectRatio}`)}`;
    const completed = this.createCompletedResult(externalJobId, aspectRatio);
    if (this.mode === 'async') {
      this.jobs.set(externalJobId, completed);
      return { externalJobId, status: JOB_STATUS.QUEUED };
    }
    return completed;
  }

  async getStatus(externalJobId) {
    if (this.mode === 'failure') {
      throw new ImageProviderError(PROVIDER_ERROR_CODES.UNAVAILABLE);
    }
    const result = this.jobs.get(externalJobId);
    if (!result) {
      return {
        status: JOB_STATUS.FAILED,
        error: new ImageProviderError(PROVIDER_ERROR_CODES.INVALID_RESPONSE).toJSON(),
      };
    }
    return result;
  }

  createCompletedResult(externalJobId, aspectRatio) {
    const [width, height] = DIMENSIONS[aspectRatio];
    return {
      externalJobId,
      status: JOB_STATUS.COMPLETED,
      image: {
        id: `fake_img_${externalJobId.slice(-16)}`,
        url: FIXTURES[aspectRatio],
        width,
        height,
        mimeType: 'image/svg+xml',
        provider: 'fake',
        model: 'deterministic-fixture-v1',
      },
    };
  }
}

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 20);
}

module.exports = FakeImageProvider;
module.exports.SUPPORTED_FAKE_MODES = SUPPORTED_FAKE_MODES;

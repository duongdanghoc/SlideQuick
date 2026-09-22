'use strict';

const JOB_STATUS = Object.freeze({
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

const ASPECT_RATIOS = Object.freeze(['1:1', '4:3', '16:9', '3:4']);

const PROVIDER_ERROR_CODES = Object.freeze({
  UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  REJECTED: 'PROVIDER_REJECTED',
  INVALID_RESPONSE: 'PROVIDER_INVALID_RESPONSE',
});

const SAFE_ERROR_MESSAGES = Object.freeze({
  [PROVIDER_ERROR_CODES.UNAVAILABLE]: 'Dịch vụ tạo ảnh đang bận. Vui lòng thử lại.',
  [PROVIDER_ERROR_CODES.REJECTED]: 'Yêu cầu tạo ảnh đã bị từ chối.',
  [PROVIDER_ERROR_CODES.INVALID_RESPONSE]: 'Dịch vụ tạo ảnh trả về dữ liệu không hợp lệ.',
});

class ImageProviderError extends Error {
  constructor(code = PROVIDER_ERROR_CODES.UNAVAILABLE, options = {}) {
    const safeCode = Object.values(PROVIDER_ERROR_CODES).includes(code)
      ? code
      : PROVIDER_ERROR_CODES.UNAVAILABLE;
    super(SAFE_ERROR_MESSAGES[safeCode]);
    this.name = 'ImageProviderError';
    this.code = safeCode;

    // Keep diagnostics private to the service boundary. They are deliberately
    // non-enumerable so JSON serialization cannot leak provider payloads.
    if (options.cause !== undefined) {
      Object.defineProperty(this, 'cause', { value: options.cause });
    }
  }

  toJSON() {
    return { code: this.code, message: this.message };
  }
}

function normalizeProviderError(error) {
  if (error instanceof ImageProviderError) return error;
  return new ImageProviderError(PROVIDER_ERROR_CODES.UNAVAILABLE, { cause: error });
}

/** @typedef {'queued'|'processing'|'completed'|'failed'} JobStatus */
/** @typedef {'1:1'|'4:3'|'16:9'|'3:4'} AspectRatio */
/**
 * @typedef {Object} ProviderImage
 * @property {string} id
 * @property {string} url
 * @property {number} width
 * @property {number} height
 * @property {string} mimeType
 * @property {string} provider
 * @property {string} model
 */
/**
 * @typedef {Object} ProviderResult
 * @property {JobStatus} status
 * @property {string} [externalJobId]
 * @property {ProviderImage} [image]
 * @property {{code: string, message: string}} [error]
 */

module.exports = {
  ASPECT_RATIOS,
  JOB_STATUS,
  PROVIDER_ERROR_CODES,
  SAFE_ERROR_MESSAGES,
  ImageProviderError,
  normalizeProviderError,
};

'use strict';

/**
 * Stable boundary implemented by image-generation adapters.
 * @interface
 */
class ImageProvider {
  /** @returns {Promise<import('../types').ProviderResult>} */
  async generate(_input) {
    throw new Error('ImageProvider.generate() must be implemented');
  }

  /** @returns {Promise<import('../types').ProviderResult>} */
  async getStatus(_externalJobId) {
    throw new Error('ImageProvider.getStatus() must be implemented');
  }
}

module.exports = ImageProvider;

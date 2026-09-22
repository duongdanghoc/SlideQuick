'use strict';

const FakeImageProvider = require('./fakeImageProvider');

const SUPPORTED_PROVIDERS = Object.freeze(['fake']);

function createImageProvider(config = {}) {
  const providerName = String(config.provider || process.env.IMAGE_PROVIDER || 'fake')
    .trim()
    .toLowerCase();

  if (!SUPPORTED_PROVIDERS.includes(providerName)) {
    throw new Error(
      `Invalid IMAGE_PROVIDER "${providerName}". Supported values: ${SUPPORTED_PROVIDERS.join(', ')}`,
    );
  }

  return new FakeImageProvider({ mode: config.fakeMode || process.env.FAKE_IMAGE_PROVIDER_MODE });
}

module.exports = { SUPPORTED_PROVIDERS, createImageProvider };

"use strict";

const FakeImageProvider = require("./fakeImageProvider");
const GeminiImageProvider = require("./geminiImageProvider");
const OpenAIImageProvider = require("./openaiImageProvider");

const SUPPORTED_PROVIDERS = Object.freeze(["fake", "gemini", "openai"]);

function createImageProvider(config = {}) {
  const providerName = String(
    config.provider || process.env.IMAGE_PROVIDER || "fake",
  )
    .trim()
    .toLowerCase();

  if (!SUPPORTED_PROVIDERS.includes(providerName)) {
    throw new Error(
      `Invalid IMAGE_PROVIDER "${providerName}". Supported values: ${SUPPORTED_PROVIDERS.join(", ")}`,
    );
  }
  if (providerName === "openai") {
    return new OpenAIImageProvider({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      model: config.model || process.env.IMAGE_MODEL,
      quality: config.quality || process.env.OPENAI_IMAGE_QUALITY,
    });
  }

  if (providerName === "gemini") {
    return new GeminiImageProvider({
      apiKey: config.apiKey || process.env.GEMINI_API_KEY,
      model: config.model || process.env.IMAGE_MODEL,
      imageSize: config.imageSize || process.env.GEMINI_IMAGE_SIZE,
      timeoutMs: config.timeoutMs || process.env.GEMINI_TIMEOUT_MS,
      endpoint: config.endpoint,
      fetch: config.fetch,
    });
  }

  return new FakeImageProvider({
    mode: config.fakeMode || process.env.FAKE_IMAGE_PROVIDER_MODE,
  });
}

module.exports = { SUPPORTED_PROVIDERS, createImageProvider };

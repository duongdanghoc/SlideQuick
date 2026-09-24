'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const FakeImageProvider = require('../../../src/features/ai-image/providers/fakeImageProvider');
const GeminiImageProvider = require('../../../src/features/ai-image/providers/geminiImageProvider');
const { createImageProvider } = require('../../../src/features/ai-image/providers/providerFactory');
const {
  ImageProviderError,
  normalizeProviderError,
} = require('../../../src/features/ai-image/types');

test('fake provider maps a synchronous success to the normalized contract', async () => {
  const provider = new FakeImageProvider();
  const first = await provider.generate({ prompt: 'A physics diagram', aspectRatio: '16:9' });
  const second = await provider.generate({ prompt: 'A physics diagram', aspectRatio: '16:9' });

  assert.deepEqual(first, second);
  assert.equal(first.status, 'completed');
  assert.equal(first.image.url, '/ai-image-fixtures/eduart-placeholder.svg');
  assert.deepEqual([first.image.width, first.image.height], [1280, 720]);
  assert.equal(first.image.provider, 'fake');
});

test('fake provider maps queued generation and status lookup', async () => {
  const provider = new FakeImageProvider({ mode: 'async' });
  const queued = await provider.generate({ prompt: 'Historic classroom scene', aspectRatio: '4:3' });
  const completed = await provider.getStatus(queued.externalJobId);

  assert.deepEqual(queued.status, 'queued');
  assert.equal(completed.status, 'completed');
  assert.deepEqual([completed.image.width, completed.image.height], [1200, 900]);
});

test('provider failures expose only normalized error fields', async () => {
  const provider = new FakeImageProvider({ mode: 'failure' });

  await assert.rejects(
    provider.generate({ prompt: 'safe prompt', aspectRatio: '1:1' }),
    (error) => {
      assert.ok(error instanceof ImageProviderError);
      assert.deepEqual(JSON.parse(JSON.stringify(error)), {
        code: 'PROVIDER_UNAVAILABLE',
        message: 'Dịch vụ tạo ảnh đang bận. Vui lòng thử lại.',
      });
      assert.doesNotMatch(JSON.stringify(error), /apiKey|providerPayload|must-not-leak/);
      return true;
    },
  );

  assert.equal(normalizeProviderError(new Error('raw provider secret')).code, 'PROVIDER_UNAVAILABLE');
});

test('factory defaults to fake and rejects unknown configuration', () => {
  assert.ok(createImageProvider({ provider: 'fake' }) instanceof FakeImageProvider);
  assert.throws(
    () => createImageProvider({ provider: 'unselected-paid-provider' }),
    /Invalid IMAGE_PROVIDER/,
  );
  assert.throws(
    () => createImageProvider({ provider: 'fake', fakeMode: 'typo' }),
    /Invalid FAKE_IMAGE_PROVIDER_MODE/,
  );
});

test('gemini provider sends the selected ratio and normalizes an image response', async () => {
  let request;
  const provider = new GeminiImageProvider({
    apiKey: 'test-only-key',
    model: 'gemini-3.1-flash-image',
    imageSize: '1K',
    fetch: async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        status: 200,
        json: async () => ({
          id: 'interaction-123',
          steps: [{ type: 'model_output', content: [{
            type: 'image',
            data: 'iVBORw0KGgo=',
            mime_type: 'image/png',
          }] }],
        }),
      };
    },
  });

  const result = await provider.generate({ prompt: 'A clear force diagram', aspectRatio: '16:9' });
  const body = JSON.parse(request.options.body);

  assert.match(request.url, /generativelanguage\.googleapis\.com/);
  assert.equal(request.options.headers['x-goog-api-key'], 'test-only-key');
  assert.equal(body.model, 'gemini-3.1-flash-image');
  assert.deepEqual(body.response_format, {
    type: 'image',
    mime_type: 'image/png',
    aspect_ratio: '16:9',
    image_size: '1K',
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.externalJobId, 'interaction-123');
  assert.equal(result.image.url, 'data:image/png;base64,iVBORw0KGgo=');
  assert.deepEqual([result.image.width, result.image.height], [1376, 768]);
  assert.equal(result.image.provider, 'gemini');
  assert.equal(result.image.model, 'gemini-3.1-flash-image');
});

test('gemini provider validates configuration without exposing credentials', async () => {
  assert.throws(() => new GeminiImageProvider(), /GEMINI_API_KEY is required/);
  assert.throws(
    () => new GeminiImageProvider({ apiKey: 'secret', imageSize: '8K' }),
    /Invalid GEMINI_IMAGE_SIZE/,
  );

  const provider = new GeminiImageProvider({
    apiKey: 'must-not-leak',
    fetch: async () => ({ ok: false, status: 429 }),
  });
  await assert.rejects(
    provider.generate({ prompt: 'safe prompt', aspectRatio: '1:1' }),
    (error) => {
      assert.equal(error.code, 'PROVIDER_UNAVAILABLE');
      assert.doesNotMatch(JSON.stringify(error), /must-not-leak/);
      return true;
    },
  );
});

test('factory creates the configured gemini provider', () => {
  const provider = createImageProvider({
    provider: 'gemini',
    apiKey: 'test-only-key',
    fetch: async () => ({ ok: true, status: 200, json: async () => ({}) }),
  });
  assert.ok(provider instanceof GeminiImageProvider);
});

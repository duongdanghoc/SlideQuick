'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const FakeImageProvider = require('../../../src/features/ai-image/providers/fakeImageProvider');
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

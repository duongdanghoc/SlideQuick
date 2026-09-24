import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateContainFit, generatedImageToSlideElement } from './generatedImageToSlideElement.ts';

const assertInsideSlide = (fit: ReturnType<typeof calculateContainFit>) => {
  assert.ok(fit.x >= 40);
  assert.ok(fit.y >= 40);
  assert.ok(fit.x + fit.width <= 920);
  assert.ok(fit.y + fit.height <= 500);
};

test('fits a landscape image without changing its aspect ratio', () => {
  const fit = calculateContainFit(1600, 900);
  assert.deepEqual(fit, { x: 71, y: 40, width: 818, height: 460 });
  assert.ok(Math.abs(fit.width / fit.height - 16 / 9) < 0.01);
  assertInsideSlide(fit);
});

test('fits and centers a portrait image', () => {
  const fit = calculateContainFit(900, 1600);
  assert.deepEqual(fit, { x: 351, y: 40, width: 259, height: 460 });
  assertInsideSlide(fit);
});

test('fits and centers a square image', () => {
  const fit = calculateContainFit(1000, 1000);
  assert.deepEqual(fit, { x: 250, y: 40, width: 460, height: 460 });
  assertInsideSlide(fit);
});

test('uses a 16:9 fallback when image dimensions are missing', () => {
  const fit = calculateContainFit(undefined, undefined);
  assert.deepEqual(fit, { x: 71, y: 40, width: 818, height: 460 });
  assertInsideSlide(fit);
});

test('creates an independent element on every insertion', () => {
  const image = { id: 'generated-1', url: 'https://example.test/image.png', width: 800, height: 600 };
  const first = generatedImageToSlideElement(image);
  const second = generatedImageToSlideElement(image);

  assert.notEqual(first.id, second.id);
  assert.equal(first.content, image.url);
  assert.equal(first.type, 'image');
  assert.deepEqual(first.style, { imageFit: 'contain' });
});

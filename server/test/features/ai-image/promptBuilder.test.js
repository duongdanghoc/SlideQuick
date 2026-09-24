'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPrompt } = require('../../../src/features/ai-image/promptBuilder');
const { PROMPT_TEMPLATES } = require('../../../src/features/ai-image/promptTemplates');
const { TAXONOMY, STYLES } = require('../../../src/features/ai-image/validation');

const base = Object.freeze({
  description: 'Minh họa một nội dung giáo dục rõ ràng',
  subject: 'history',
  gradeLevel: 'secondary',
  imageType: 'historical_event',
  style: 'educational_illustration',
  aspectRatio: '16:9',
});

test('returns a deterministic PromptBuildResult', () => {
  assert.deepEqual(buildPrompt(base), buildPrompt({ ...base }));
  const result = buildPrompt(base);
  assert.equal(typeof result.optimizedPrompt, 'string');
  assert.ok(result.appliedRules.every((rule) => typeof rule.id === 'string' && typeof rule.label === 'string'));
});

test('history and physics rules never leak across subjects', () => {
  const history = buildPrompt(base);
  const physics = buildPrompt({ ...base, subject: 'physics', imageType: 'phenomenon' });
  assert.ok(history.appliedRules.every(({ id }) => id.startsWith('history.')));
  assert.ok(physics.appliedRules.every(({ id }) => id.startsWith('physics.')));
  assert.notDeepEqual(history, physics);
});

test('force diagrams include vector and no-invented-values rules', () => {
  const result = buildPrompt({ ...base, subject: 'physics', imageType: 'force_diagram' });
  const ids = result.appliedRules.map(({ id }) => id);
  assert.ok(ids.includes('physics.vector-direction'));
  assert.ok(ids.includes('physics.no-invented-values'));
  assert.match(result.optimizedPrompt, /Do not invent measurements, values, or equations/);
});

test('Vietnam history content selects the Vietnam context rule', () => {
  const result = buildPrompt({ ...base, description: 'Tái hiện lớp học tại Việt Nam năm 1945', style: 'historical_painting' });
  const ids = result.appliedRules.map(({ id }) => id);
  assert.ok(ids.includes('history.vietnam-context'));
  assert.ok(ids.includes('history.not-documentary'));
  assert.ok(!ids.includes('history.neutral-unknowns'));
});

test('history requests with unspecified period and place stay neutral', () => {
  const result = buildPrompt(base);
  assert.ok(result.appliedRules.some(({ id }) => id === 'history.neutral-unknowns'));
});

test('prompt override retains rules and shared hard constraints', () => {
  const result = buildPrompt({ ...base, promptOverride: 'Use a quiet, minimal composition' });
  assert.match(result.optimizedPrompt, /User intent: Use a quiet, minimal composition/);
  assert.doesNotMatch(result.optimizedPrompt, new RegExp(base.description));
  assert.match(result.optimizedPrompt, /Do not include watermarks/);
  assert.match(result.optimizedPrompt, /Do not invent named people/);
});

test('grade, image type, style, and ratio adapt the prompt', () => {
  const result = buildPrompt({ ...base, gradeLevel: 'primary', imageType: 'daily_life', style: 'flat_illustration', aspectRatio: '4:3' });
  assert.match(result.optimizedPrompt, /few details, familiar objects/);
  assert.match(result.optimizedPrompt, /everyday life/);
  assert.match(result.optimizedPrompt, /flat illustration/);
  assert.match(result.optimizedPrompt, /Aspect ratio: 4:3/);
});

test('provides eight valid static UI prompt templates', () => {
  assert.equal(PROMPT_TEMPLATES.length, 8);
  assert.equal(new Set(PROMPT_TEMPLATES.map(({ id }) => id)).size, 8);
  for (const template of PROMPT_TEMPLATES) {
    assert.ok(TAXONOMY[template.subject].includes(template.imageType));
  }
  assert.ok(STYLES.includes('educational_illustration'));
});

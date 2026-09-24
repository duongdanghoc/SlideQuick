'use strict';

const { ASPECT_RATIOS } = require('./types');

const TAXONOMY = Object.freeze({
  history: Object.freeze(['historical_event', 'daily_life', 'historical_character', 'historical_architecture']),
  physics: Object.freeze(['phenomenon', 'force_diagram', 'experiment_model', 'real_world_application']),
});
const GRADE_LEVELS = Object.freeze(['primary', 'secondary', 'high_school']);
const STYLES = Object.freeze([
  'educational_illustration',
  'clean_diagram',
  'flat_illustration',
  'realistic',
  'historical_painting',
]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateCreateJob(body = {}) {
  const fields = {};
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (description.length < 10 || description.length > 1000) fields.description = 'Mô tả phải có 10–1000 ký tự.';
  if (!Object.hasOwn(TAXONOMY, body.subject)) fields.subject = 'Môn học không hợp lệ.';
  if (!GRADE_LEVELS.includes(body.gradeLevel)) fields.gradeLevel = 'Cấp học không hợp lệ.';
  if (!TAXONOMY[body.subject]?.includes(body.imageType)) fields.imageType = 'Loại hình ảnh không hợp lệ.';
  if (!STYLES.includes(body.style)) fields.style = 'Phong cách không hợp lệ.';
  if (!ASPECT_RATIOS.includes(body.aspectRatio)) fields.aspectRatio = 'Tỷ lệ ảnh không hợp lệ.';
  if (body.promptOverride != null && (typeof body.promptOverride !== 'string' || body.promptOverride.length > 3000)) {
    fields.promptOverride = 'Prompt tùy chỉnh không được vượt quá 3000 ký tự.';
  }
  for (const field of ['projectId', 'slideId']) {
    if (body[field] != null && (typeof body[field] !== 'string' || body[field].trim() === '' || body[field].length > 200)) {
      fields[field] = `${field} is invalid.`;
    }
  }
  return { valid: Object.keys(fields).length === 0, fields, description };
}

function isValidIdempotencyKey(value) {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

module.exports = { validateCreateJob, isValidIdempotencyKey, TAXONOMY, GRADE_LEVELS, STYLES };

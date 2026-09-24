'use strict';

const SHARED_CONSTRAINTS = Object.freeze([
  'Create an educational illustration with a clear central subject',
  'Keep the image age-appropriate and classroom-safe',
  'Do not include watermarks, logos, or decorative text',
  'Avoid generated text, labels, equations, and numerical values unless explicitly essential to the request',
  'Do not introduce people, events, objects, or values absent from the request',
  'Leave visual space for labels to be added in the slide editor when relevant',
]);

const GRADE_INSTRUCTIONS = Object.freeze({
  primary: 'Use few details, familiar objects, and one clear main idea',
  secondary: 'Show clear cause-and-effect relationships with moderate visual complexity',
  high_school: 'Use accurate structures and relationships while avoiding visual clutter',
});

const IMAGE_TYPE_INSTRUCTIONS = Object.freeze({
  historical_event: 'Reconstruct the requested historical event as a coherent educational scene',
  daily_life: 'Depict everyday life with period-appropriate objects and activities',
  historical_character: 'Place the requested historical character in a plausible period context',
  historical_architecture: 'Make the requested historical architecture the visual focus',
  phenomenon: 'Make the physical phenomenon immediately visible',
  force_diagram: 'Use a clean force-diagram composition with clear objects and room for overlay labels',
  experiment_model: 'Show the experiment setup and its relevant components clearly',
  real_world_application: 'Show one concrete real-world application of the physical principle',
});

const STYLE_INSTRUCTIONS = Object.freeze({
  educational_illustration: 'Use a clear educational illustration style',
  clean_diagram: 'Use a clean, uncluttered diagram style',
  flat_illustration: 'Use a simple flat illustration style with distinct shapes',
  realistic: 'Use a realistic educational reconstruction style',
  historical_painting: 'Use a historical painting style while remaining clearly educational',
});

const HISTORY_RULES = Object.freeze({
  vietnam: Object.freeze({ id: 'history.vietnam-context', label: 'Ưu tiên bối cảnh Việt Nam phù hợp', instruction: 'Use historically plausible Vietnamese clothing, architecture, and setting for the specified period or region' }),
  period: Object.freeze({ id: 'history.period-consistency', label: 'Không trộn chi tiết khác thời kỳ', instruction: 'Do not mix artifacts, clothing, or architecture from different periods' }),
  invented: Object.freeze({ id: 'history.no-invented-event', label: 'Không tự thêm nhân vật/sự kiện', instruction: 'Do not invent named people, symbols, or events' }),
  reconstruction: Object.freeze({ id: 'history.not-documentary', label: 'Xác định đây là hình tái hiện', instruction: 'Present this as an educational reconstruction, not an authentic archival record' }),
  neutral: Object.freeze({ id: 'history.neutral-unknowns', label: 'Không bịa chi tiết còn thiếu', instruction: 'Keep unspecified period and location details neutral instead of fabricating specifics' }),
});

const PHYSICS_RULES = Object.freeze({
  phenomenon: Object.freeze({ id: 'physics.clear-phenomenon', label: 'Tập trung vào hiện tượng chính', instruction: 'Focus on one clearly visible physical phenomenon' }),
  vector: Object.freeze({ id: 'physics.vector-direction', label: 'Thể hiện rõ chiều vector', instruction: 'Show clear vector direction and point of application only when provided or physically implied' }),
  values: Object.freeze({ id: 'physics.no-invented-values', label: 'Không tự thêm số liệu/công thức', instruction: 'Do not invent measurements, values, or equations' }),
  text: Object.freeze({ id: 'physics.minimize-text', label: 'Hạn chế chữ do AI sinh', instruction: 'Avoid text labels and leave space for accurate slide text overlays' }),
  grade: Object.freeze({ id: 'physics.grade-level', label: 'Điều chỉnh theo cấp học', instruction: 'Match visual complexity to the selected grade level' }),
});

function buildPrompt(input) {
  const intent = input.promptOverride?.trim() || input.description.trim();
  const rules = selectSubjectRules(input);
  const parts = [
    `User intent: ${intent}.`,
    `Subject context: ${input.subject === 'history' ? 'History education' : 'Physics education'}.`,
    `Grade adaptation: ${GRADE_INSTRUCTIONS[input.gradeLevel]}.`,
    `Image type: ${IMAGE_TYPE_INSTRUCTIONS[input.imageType]}.`,
    `Style and composition: ${STYLE_INSTRUCTIONS[input.style]}.`,
    `Subject rules: ${rules.map((rule) => rule.instruction).join('; ')}.`,
    `Hard constraints: ${SHARED_CONSTRAINTS.join('; ')}.`,
    `Aspect ratio: ${input.aspectRatio}.`,
  ];

  return {
    optimizedPrompt: parts.join('\n'),
    appliedRules: rules.map(({ id, label }) => ({ id, label })),
  };
}

function selectSubjectRules(input) {
  if (input.subject === 'history') {
    const rules = [];
    if (isVietnameseContext(input.description)) rules.push(HISTORY_RULES.vietnam);
    rules.push(HISTORY_RULES.period, HISTORY_RULES.invented);
    if (['realistic', 'historical_painting'].includes(input.style)) rules.push(HISTORY_RULES.reconstruction);
    if (!hasPeriodOrLocation(input.description)) rules.push(HISTORY_RULES.neutral);
    return rules;
  }

  const rules = [PHYSICS_RULES.phenomenon];
  if (input.imageType === 'force_diagram') rules.push(PHYSICS_RULES.vector);
  rules.push(PHYSICS_RULES.values, PHYSICS_RULES.text, PHYSICS_RULES.grade);
  return rules;
}

function normalizeText(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function isVietnameseContext(description) {
  const text = normalizeText(description);
  return /\b(viet nam|vietnam|ha noi|hanoi|sai gon|saigon|hue|dong duong|indochina)\b/.test(text);
}

function hasPeriodOrLocation(description) {
  const text = normalizeText(description);
  const hasYearOrPeriod = /\b(?:nam\s+)?\d{3,4}\b|\b(the ky|thoi ky|trieu dai|co dai|trung dai|can dai|hien dai)\b/.test(text);
  const hasLocation = /\b(tai|o|mien|vung|thanh pho|lang|nuoc)\s+[a-z]/.test(text) || isVietnameseContext(text);
  return hasYearOrPeriod || hasLocation;
}

module.exports = { buildPrompt, selectSubjectRules, SHARED_CONSTRAINTS };

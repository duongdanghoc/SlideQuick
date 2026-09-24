// src/config/env.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  NODE_ENV: process.env.NODE_ENV || 'development',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || 'fake',
  IMAGE_MODEL: process.env.IMAGE_MODEL || 'gemini-3.1-flash-image',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_IMAGE_SIZE: process.env.GEMINI_IMAGE_SIZE || '1K',
  GEMINI_TIMEOUT_MS: process.env.GEMINI_TIMEOUT_MS || '60000',
  FAKE_IMAGE_PROVIDER_MODE: process.env.FAKE_IMAGE_PROVIDER_MODE || 'success',
  AI_IMAGE_GENERATION_ENABLED: process.env.AI_IMAGE_GENERATION_ENABLED !== 'false',
  AI_IMAGE_DAILY_LIMIT_PER_USER: process.env.AI_IMAGE_DAILY_LIMIT_PER_USER || '5',
  AI_IMAGE_DAILY_LIMIT_GLOBAL: process.env.AI_IMAGE_DAILY_LIMIT_GLOBAL || '50',
  AI_IMAGE_MAX_CONCURRENT_PER_USER: process.env.AI_IMAGE_MAX_CONCURRENT_PER_USER || '1',
  AI_IMAGE_COOLDOWN_SECONDS: process.env.AI_IMAGE_COOLDOWN_SECONDS || '30',
  AI_IMAGE_STORAGE: process.env.AI_IMAGE_STORAGE || 'local',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || 'uploads',
};

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const Database = require('better-sqlite3');
const { AiImageService } = require('../../../src/features/ai-image/aiImageService');
const { ImageProviderError, PROVIDER_ERROR_CODES } = require('../../../src/features/ai-image/types');
const { createAiImageController } = require('../../../src/controllers/aiImageController');
const { createAiImageRouter, aiImageAuth } = require('../../../src/routes/aiImageRoutes');

const VALID_KEY = '123e4567-e89b-42d3-a456-426614174000';
const INPUT = { description: 'A clear classroom force diagram for a wooden box', subject: 'physics', gradeLevel: 'secondary', imageType: 'force_diagram', style: 'clean_diagram', aspectRatio: '16:9', projectId: 'p1' };

async function createHarness(provider) {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE projects (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, is_deleted INTEGER DEFAULT 0);
    CREATE TABLE slides (id TEXT PRIMARY KEY, project_id TEXT NOT NULL);
    CREATE TABLE ai_image_jobs (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,project_id TEXT,slide_id TEXT,idempotency_key TEXT NOT NULL,source_prompt TEXT NOT NULL,optimized_prompt TEXT NOT NULL,options_json TEXT NOT NULL,applied_rules_json TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,external_job_id TEXT,status TEXT NOT NULL,error_code TEXT,created_at TEXT NOT NULL,completed_at TEXT,UNIQUE(user_id,idempotency_key));
    CREATE TABLE generated_images (id TEXT PRIMARY KEY,job_id TEXT NOT NULL UNIQUE,user_id TEXT NOT NULL,storage_key TEXT,storage_url TEXT NOT NULL,width INTEGER NOT NULL,height INTEGER NOT NULL,mime_type TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,created_at TEXT NOT NULL);
    INSERT INTO projects VALUES ('p1','u1',0);
  `);
  const storage = { store: async (image) => ({ storageKey: null, storageUrl: image.url }) };
  const service = new AiImageService({ db, provider, storage, providerName: 'fake' });
  const controller = createAiImageController(service);
  const auth = (req, res, next) => { req.user = { id: req.get('x-test-user') || 'u1' }; next(); };
  const app = express();
  app.use(express.json());
  app.use('/api/ai-images', createAiImageRouter({ auth, controller }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  return { db, server, baseUrl: `http://127.0.0.1:${server.address().port}/api/ai-images` };
}

function closeHarness(harness) {
  return new Promise((resolve) => {
    harness.server.close(() => { harness.db.close(); resolve(); });
    harness.server.closeAllConnections();
  });
}

function completedImage() {
  return { status: 'completed', image: { id: 'img_api', url: '/fixture.svg', width: 1280, height: 720, mimeType: 'image/svg+xml', provider: 'fake', model: 'test' } };
}

function postJob(baseUrl, body = INPUT, key = VALID_KEY) {
  return fetch(`${baseUrl}/jobs`, { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': key }, body: JSON.stringify(body) });
}

test('authentication failures use the API error envelope', () => {
  let status;
  let payload;
  const req = { get: () => undefined };
  const res = { status(value) { status = value; return this; }, json(value) { payload = value; return this; } };
  aiImageAuth(req, res, () => assert.fail('authentication should not pass'));
  assert.equal(status, 401);
  assert.equal(payload.error.code, 'UNAUTHENTICATED');
  assert.ok(payload.error.requestId);
});

test('POST creates a job and duplicate UUID does not call the provider twice', async (t) => {
  let calls = 0;
  const harness = await createHarness({ generate: async () => { calls += 1; return completedImage(); } });
  t.after(() => closeHarness(harness));
  const first = await postJob(harness.baseUrl);
  const firstBody = await first.json();
  const secondBody = await (await postJob(harness.baseUrl)).json();
  assert.equal(first.status, 200);
  assert.equal(secondBody.data.jobId, firstBody.data.jobId);
  assert.equal(firstBody.data.status, 'completed');
  assert.equal(calls, 1);
});

test('POST returns processing and GET polls to completion', async (t) => {
  const harness = await createHarness({ generate: async () => ({ status: 'processing', externalJobId: 'external-1' }), getStatus: async () => completedImage() });
  t.after(() => closeHarness(harness));
  const created = await postJob(harness.baseUrl);
  const createdBody = await created.json();
  assert.equal(created.status, 202);
  assert.equal(createdBody.data.status, 'processing');
  const body = await (await fetch(`${harness.baseUrl}/jobs/${createdBody.data.jobId}`)).json();
  assert.equal(body.data.status, 'completed');
});

test('provider failure is persisted without leaking diagnostics', async (t) => {
  const secret = 'provider-secret-that-must-not-leak';
  const provider = { generate: async () => { throw new ImageProviderError(PROVIDER_ERROR_CODES.UNAVAILABLE, { cause: secret }); } };
  const harness = await createHarness(provider);
  t.after(() => closeHarness(harness));
  const response = await postJob(harness.baseUrl);
  const text = await response.text();
  const body = JSON.parse(text);
  assert.equal(body.data.status, 'failed');
  assert.equal(body.data.error.code, 'PROVIDER_UNAVAILABLE');
  assert.equal(text.includes(secret), false);
});

test('validation and missing jobs use error envelopes', async (t) => {
  const harness = await createHarness({ generate: async () => completedImage() });
  t.after(() => closeHarness(harness));
  const invalid = await postJob(harness.baseUrl, { ...INPUT, description: 'short' }, 'not-a-uuid');
  const invalidBody = await invalid.json();
  assert.equal(invalid.status, 400);
  assert.equal(invalidBody.error.code, 'VALIDATION_ERROR');
  assert.ok(invalidBody.error.fields.idempotencyKey);
  const missing = await fetch(`${harness.baseUrl}/jobs/job_missing`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, 'JOB_NOT_FOUND');
});

test('GET enforces ownership', async (t) => {
  const harness = await createHarness({ generate: async () => completedImage() });
  t.after(() => closeHarness(harness));
  const jobId = (await (await postJob(harness.baseUrl)).json()).data.jobId;
  const response = await fetch(`${harness.baseUrl}/jobs/${jobId}`, { headers: { 'x-test-user': 'u2' } });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, 'FORBIDDEN');
});

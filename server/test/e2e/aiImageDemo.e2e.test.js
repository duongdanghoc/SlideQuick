'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const Database = require('better-sqlite3');
const { AiImageService } = require('../../src/features/ai-image/aiImageService');
const FakeImageProvider = require('../../src/features/ai-image/providers/fakeImageProvider');
const { createAiImageController } = require('../../src/controllers/aiImageController');
const { createAiImageRouter } = require('../../src/routes/aiImageRoutes');

const scenarios = [
  {
    name: 'History: 1945 literacy classroom',
    input: {
      description: 'Tái hiện một lớp học bình dân học vụ tại Việt Nam năm 1945, không khí giản dị, dùng làm minh họa bài học.',
      subject: 'history', gradeLevel: 'secondary', imageType: 'historical_event',
      style: 'historical_painting', aspectRatio: '16:9', promptOverride: null,
    },
    rules: ['history.vietnam-context', 'history.period-consistency', 'history.not-documentary'],
  },
  {
    name: 'Physics: forces on a wooden crate',
    input: {
      description: 'Minh họa một thùng gỗ đang được kéo trên mặt sàn ngang để học sinh nhận biết lực kéo, trọng lực, phản lực và lực ma sát.',
      subject: 'physics', gradeLevel: 'secondary', imageType: 'force_diagram',
      style: 'clean_diagram', aspectRatio: '4:3', promptOverride: null,
    },
    rules: ['physics.vector-direction', 'physics.no-invented-values', 'physics.minimize-text'],
  },
];

function createDatabase() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE ai_image_jobs (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,project_id TEXT,slide_id TEXT,idempotency_key TEXT NOT NULL,source_prompt TEXT NOT NULL,optimized_prompt TEXT NOT NULL,options_json TEXT NOT NULL,applied_rules_json TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,external_job_id TEXT,status TEXT NOT NULL,error_code TEXT,created_at TEXT NOT NULL,completed_at TEXT,UNIQUE(user_id,idempotency_key));
    CREATE TABLE generated_images (id TEXT PRIMARY KEY,job_id TEXT NOT NULL UNIQUE,user_id TEXT NOT NULL,storage_key TEXT,storage_url TEXT NOT NULL,width INTEGER NOT NULL,height INTEGER NOT NULL,mime_type TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,created_at TEXT NOT NULL);
    CREATE TABLE projects (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, is_deleted INTEGER DEFAULT 0);
    CREATE TABLE slides (id TEXT PRIMARY KEY, project_id TEXT NOT NULL);
  `);
  return db;
}

async function start(mode = 'success') {
  const db = createDatabase();
  const service = new AiImageService({
    db,
    provider: new FakeImageProvider({ mode }),
    providerName: 'fake',
    storage: { store: async (image) => ({ storageKey: null, storageUrl: image.url }) },
  });
  const app = express();
  app.use(express.json());
  app.use('/api/ai-images', createAiImageRouter({
    auth: (req, _res, next) => { req.user = { id: 'demo-user' }; next(); },
    controller: createAiImageController(service),
  }));
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  return { db, server, url: `http://127.0.0.1:${server.address().port}/api/ai-images` };
}

async function stop(harness) {
  await new Promise((resolve) => {
    harness.server.close(resolve);
    harness.server.closeAllConnections();
  });
  harness.db.close();
}

for (const [index, scenario] of scenarios.entries()) {
  test(scenario.name, async (t) => {
    const harness = await start('async');
    t.after(() => stop(harness));
    const response = await fetch(`${harness.url}/jobs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'idempotency-key': `00000000-0000-4000-8000-00000000000${index}` },
      body: JSON.stringify(scenario.input),
    });
    assert.equal(response.status, 202);
    const created = (await response.json()).data;
    assert.equal(created.status, 'queued');

    const completed = (await (await fetch(`${harness.url}/jobs/${created.jobId}`)).json()).data;
    assert.equal(completed.status, 'completed');
    assert.equal(completed.image.provider, 'fake');
    assert.match(completed.image.url, /^\/ai-image-fixtures\/eduart-placeholder(?:-4x3)?\.svg$/);
    assert.ok(completed.image.width > 0 && completed.image.height > 0);
    const ids = completed.appliedRules.map((rule) => rule.id);
    for (const rule of scenario.rules) assert.ok(ids.includes(rule), `missing ${rule}`);
    assert.match(completed.optimizedPrompt, /Do not include watermarks/);
  });
}

test('fake provider failure reaches a safe terminal response', async (t) => {
  const harness = await start('failure');
  t.after(() => stop(harness));
  const response = await fetch(`${harness.url}/jobs`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': '00000000-0000-4000-8000-000000000099' },
    body: JSON.stringify(scenarios[0].input),
  });
  const text = await response.text();
  const job = JSON.parse(text).data;
  assert.equal(job.status, 'failed');
  assert.deepEqual(Object.keys(job.error).sort(), ['code', 'message']);
  assert.equal(job.error.code, 'PROVIDER_UNAVAILABLE');
  assert.doesNotMatch(text, /apiKey|providerPayload|must-not-leak|stack/i);
});

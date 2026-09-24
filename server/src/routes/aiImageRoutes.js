'use strict';

const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const defaultController = require('../controllers/aiImageController');

function aiImageAuth(req, res, next) {
  const authorization = req.get('authorization');
  const match = /^Bearer\s+(.+)$/.exec(authorization || '');
  if (!match) return unauthenticated(res);
  try {
    req.user = jwt.verify(match[1], JWT_SECRET);
    return next();
  } catch {
    return unauthenticated(res);
  }
}

function unauthenticated(res) {
  return res.status(401).json({ error: {
    code: 'UNAUTHENTICATED',
    message: 'Authentication is required.',
    requestId: crypto.randomUUID(),
  } });
}

function createAiImageRouter({ auth = aiImageAuth, controller = defaultController } = {}) {
  const router = express.Router();
  router.use(auth);
  router.post('/jobs', controller.createJob);
  router.get('/jobs/:jobId', controller.getJob);
  return router;
}

module.exports = createAiImageRouter();
module.exports.createAiImageRouter = createAiImageRouter;
module.exports.aiImageAuth = aiImageAuth;

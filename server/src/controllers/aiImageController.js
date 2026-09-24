'use strict';

const crypto = require('crypto');
const { AiImageService, AiImageServiceError } = require('../features/ai-image/aiImageService');
const { validateCreateJob, isValidIdempotencyKey } = require('../features/ai-image/validation');

function createAiImageController(service = new AiImageService()) {
  async function createJob(req, res) {
    try {
      const idempotencyKey = req.get('Idempotency-Key');
      if (!isValidIdempotencyKey(idempotencyKey)) {
        return sendError(res, 400, 'VALIDATION_ERROR', 'Idempotency-Key must be a valid UUID.', {
          idempotencyKey: 'Idempotency-Key must be a valid UUID.',
        });
      }

      const validation = validateCreateJob(req.body);
      if (!validation.valid) {
        return sendError(res, 400, 'VALIDATION_ERROR', 'The request data is invalid.', validation.fields);
      }

      const result = await service.createJob({
        userId: req.user.id,
        idempotencyKey,
        input: { ...req.body, description: validation.description },
      });
      return res.status(result.job.status === 'completed' ? 200 : 202).json({ data: result.job });
    } catch (error) {
      return handleError(error, res);
    }
  }

  async function getJob(req, res) {
    try {
      return res.json({ data: await service.getJob(req.params.jobId, req.user.id) });
    } catch (error) {
      return handleError(error, res);
    }
  }

  return { createJob, getJob };
}

function handleError(error, res) {
  if (!(error instanceof AiImageServiceError)) {
    return sendError(res, 500, 'INTERNAL_ERROR', 'The system encountered an error. Please try again.');
  }
  const body = {
    code: error.code,
    message: error.message,
    requestId: crypto.randomUUID(),
  };
  if (error.retryAfter) body.retryAfter = error.retryAfter;
  return res.status(error.status).json({ error: body });
}

function sendError(res, status, code, message, fields) {
  const error = { code, message, requestId: crypto.randomUUID() };
  if (fields) error.fields = fields;
  return res.status(status).json({ error });
}

module.exports = createAiImageController();
module.exports.createAiImageController = createAiImageController;

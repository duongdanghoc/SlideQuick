# Task 03 — Generate Job API

## Goal

Triển khai create/get job, persistence và orchestration theo API contract.

## Read

- `API_CONTRACT.md`
- `ARCHITECTURE.md`
- `features/ai-image/DATA_MODEL.md`
- `CODING_RULES.md`

## Dependencies

- Provider contract/fake từ Task 01.
- Prompt Builder từ Task 02 có thể tích hợp qua stable interface; nếu chạy song song, dùng stub đúng contract rồi thay trước khi merge.

## Work

1. Migration/schema cho hai entity.
2. Request validation và allowlists.
3. `POST /api/ai-images/jobs` với idempotency.
4. `GET /api/ai-images/jobs/:jobId` với ownership nếu auth có sẵn.
5. Service: create job → build prompt → call provider → persist terminal result.
6. Status/error normalization và safe message.
7. Storage abstraction/implementation tối thiểu.
8. Integration tests với fake provider.

## Do not

- Triển khai optional list/delete trừ khi P0 đã xong và được giao rõ.
- Trả raw provider error.
- Lưu base64 vào database/log.
- Đưa provider logic vào controller.

## Done when

- Request/response khớp contract.
- Duplicate idempotency key không gọi provider lần hai.
- Success, processing, provider failure, validation và not-found có test.
- Không cần API key để test.

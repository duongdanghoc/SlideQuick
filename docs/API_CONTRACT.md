# API Contract

Base path: `/api/ai-images`. Mọi response dùng JSON, trừ file ảnh do storage phục vụ.

## 1. Create image job

`POST /api/ai-images/jobs`

Headers:

```http
Content-Type: application/json
Authorization: Bearer <jwt>
Idempotency-Key: <uuid>
```

Request:

```json
{
  "description": "Minh họa lực kéo và lực ma sát tác dụng lên một thùng gỗ",
  "subject": "physics",
  "gradeLevel": "secondary",
  "imageType": "force_diagram",
  "style": "clean_diagram",
  "aspectRatio": "16:9",
  "promptOverride": null,
  "projectId": "optional-project-id",
  "slideId": "optional-slide-id"
}
```

Validation:

- `description`: trim, 10–1000 ký tự.
- `subject`: `history | physics`.
- `gradeLevel`: `primary | secondary | high_school`.
- `aspectRatio`: `1:1 | 4:3 | 16:9 | 3:4`.
- `imageType` phải thuộc taxonomy của subject.
- `style` phải thuộc allowlist.
- `promptOverride`: tối đa 3000 ký tự, optional.
- Idempotency key: bắt buộc; cùng user + key trả lại cùng job.

Response `202 Accepted`:

```json
{
  "data": {
    "jobId": "job_123",
    "status": "queued",
    "optimizedPrompt": "...",
    "appliedRules": [
      { "id": "physics.no-invented-values", "label": "Không tự thêm số liệu" },
      { "id": "physics.vector-direction", "label": "Thể hiện rõ chiều vector" }
    ],
    "createdAt": "2026-09-22T14:00:00.000Z"
  }
}
```

Provider đồng bộ có thể trả `200 OK` và `status: completed` với `image`; client phải hỗ trợ cả hai.

## 2. Get job

`GET /api/ai-images/jobs/:jobId`

Response khi đang xử lý:

```json
{
  "data": {
    "jobId": "job_123",
    "status": "processing",
    "optimizedPrompt": "...",
    "appliedRules": [],
    "createdAt": "2026-09-22T14:00:00.000Z",
    "completedAt": null,
    "image": null,
    "error": null
  }
}
```

Response hoàn tất:

```json
{
  "data": {
    "jobId": "job_123",
    "status": "completed",
    "optimizedPrompt": "...",
    "appliedRules": [],
    "createdAt": "2026-09-22T14:00:00.000Z",
    "completedAt": "2026-09-22T14:00:12.000Z",
    "image": {
      "id": "img_123",
      "url": "/uploads/ai/img_123.png",
      "width": 1536,
      "height": 864,
      "mimeType": "image/png",
      "provider": "configured-provider",
      "model": "configured-model"
    },
    "error": null
  }
}
```

Response thất bại vẫn có HTTP `200` vì job tồn tại:

```json
{
  "data": {
    "jobId": "job_123",
    "status": "failed",
    "image": null,
    "error": {
      "code": "PROVIDER_UNAVAILABLE",
      "message": "Dịch vụ tạo ảnh đang bận. Vui lòng thử lại."
    }
  }
}
```

## 3. Optional recent images

`GET /api/ai-images?limit=12`

Chỉ triển khai ở P1. `limit` từ 1–20; kết quả chỉ thuộc user hiện tại.

## 4. Optional delete image

`DELETE /api/ai-images/:imageId`

Chỉ triển khai ở P1. Phải kiểm tra ownership. Trả `204 No Content`.

## 5. Error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu chưa hợp lệ.",
    "fields": {
      "description": "Mô tả phải có ít nhất 10 ký tự."
    },
    "requestId": "req_123"
  }
}
```

| HTTP | Code | Ý nghĩa |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Input sai taxonomy/độ dài |
| 401 | `UNAUTHENTICATED` | Chưa đăng nhập nếu app có auth |
| 403 | `FORBIDDEN` | Không sở hữu job/image |
| 404 | `JOB_NOT_FOUND` | Job không tồn tại |
| 409 | `JOB_CONFLICT` | Trạng thái/idempotency xung đột |
| 429 | `RATE_LIMITED` | Tạo quá nhiều request |
| 429 | `DAILY_QUOTA_EXCEEDED` | Hết quota demo theo người dùng hoặc toàn hệ thống |
| 500 | `INTERNAL_ERROR` | Lỗi hệ thống đã được làm sạch |
| 503 | `PROVIDER_UNAVAILABLE` | Provider tạm thời không dùng được |

Không trả raw stack trace hoặc provider error cho client.

## 6. Polling contract

- Poll lần đầu sau 1 giây.
- Khoảng cách 2 giây; có thể backoff tối đa 5 giây.
- Dừng khi terminal state.
- Timeout UI mặc định 90 giây; timeout UI không tự xóa job.
- Rời/unmount panel phải hủy timer/abort request cục bộ.

# Architecture

## 1. Mục tiêu

- Tách UI, business logic, provider và storage.
- Có thể chạy test/demo với fake provider.
- Không để frontend phụ thuộc SDK/provider cụ thể.
- Giữ thay đổi nhỏ và phù hợp cấu trúc SlideQuick hiện có.

## 2. Luồng xử lý

```text
AIImagePanel
  → aiImageClient.createJob(input)
  → POST /api/ai-images/jobs
  → request validation
  → PromptBuilder.build(input)
  → ImageProvider.generate(prompt, options)
  → persist job/image metadata
  → client polls GET /api/ai-images/jobs/:id
  → GeneratedImagePreview
  → slide image adapter
  → existing editor state/save/export
```

## 3. Module boundaries

| Module | Trách nhiệm | Không được làm |
|---|---|---|
| UI components | Thu input, render state, phát action | Gọi provider SDK, chứa API key, tự build prompt |
| `aiImageClient` | HTTP contract + polling | Quyết định rule sư phạm |
| Controller/route | Auth, validate, map HTTP | Ghép prompt hoặc chứa provider-specific code |
| Prompt Builder | Input → optimized prompt + applied rules | Gọi database/provider |
| Subject rules | Rule thuần theo Lịch sử/Vật lý | Đọc request/response HTTP |
| AI image service | Orchestrate job/provider/storage | Render UI |
| ImageProvider | Chuẩn hóa giao tiếp provider | Biết SlideElement |
| Storage service | Lưu ảnh và trả metadata/URL | Ghép prompt |
| Slide adapter | Generated image → SlideElement | Gọi provider |

## 4. Core types

```ts
type Subject = 'history' | 'physics';
type GradeLevel = 'primary' | 'secondary' | 'high_school';
type AspectRatio = '1:1' | '4:3' | '16:9' | '3:4';
type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

interface GenerateImageInput {
  description: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  imageType: string;
  style: string;
  aspectRatio: AspectRatio;
  promptOverride?: string;
  projectId?: string;
  slideId?: string;
  idempotencyKey: string;
}

interface PromptBuildResult {
  optimizedPrompt: string;
  appliedRules: Array<{ id: string; label: string }>;
}

interface ImageProvider {
  generate(input: {
    prompt: string;
    aspectRatio: AspectRatio;
  }): Promise<{ externalJobId?: string; status: JobStatus; image?: ProviderImage }>;

  getStatus(externalJobId: string): Promise<{
    status: JobStatus;
    image?: ProviderImage;
  }>;
}
```

Tên type/file có thể đổi để khớp codebase, nhưng semantics và API contract phải giữ nguyên.

## 5. Job state machine

```text
queued → processing → completed
                    ↘ failed
queued ─────────────↘ failed
```

- Không chuyển từ terminal state sang state khác.
- Provider đồng bộ vẫn được map qua job contract; job có thể hoàn thành ngay trong request đầu.
- Client dừng polling khi `completed`, `failed` hoặc quá timeout cục bộ.

## 6. Prompt override

- Basic mode không gửi `promptOverride`.
- Advanced preview có thể gửi prompt người dùng đã sửa.
- Backend vẫn validation độ dài/safety và bổ sung hard constraints.
- `sourcePrompt` là mô tả gốc; `optimizedPrompt` là prompt cuối gửi provider.

## 7. Storage

- Development/prototype có thể dùng local storage qua abstraction.
- URL trả frontend phải tải/render được trong môi trường hiện tại.
- Không lưu base64 lớn trong SQLite hoặc log.
- Metadata ảnh gắn với `jobId` và `userId` nếu auth tồn tại.

## 8. Security

- API key chỉ ở environment/backend.
- Không trả raw provider response/error.
- Không log authorization header, API key, image base64 hoặc prompt nhạy cảm đầy đủ.
- Validate enum, chiều dài mô tả và ownership.
- Rate limit cơ bản cho endpoint tạo job.

## 9. Repository adaptation checklist

Agent đầu tiên phải xác nhận:

- package manager và lệnh test/build;
- frontend/backend folder thực tế;
- router/controller/service conventions;
- auth middleware;
- database/migration mechanism;
- `SlideElement` image shape;
- editor state update action;
- save/export pipeline.

Kết quả mapping phải được ghi trong báo cáo Task 01 hoặc cập nhật docs.

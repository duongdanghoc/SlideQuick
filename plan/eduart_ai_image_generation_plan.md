# Kế hoạch phát triển chức năng tạo hình ảnh giáo dục bằng AI

## 1. Mục tiêu

Mở rộng EduArt AI từ một nền tảng tạo và chỉnh sửa bài trình chiếu thành công cụ hỗ trợ giáo viên tạo, quản lý và sử dụng hình ảnh giáo dục bằng AI. Chức năng mới phải:

- Nhận mô tả bằng tiếng Việt và tạo hình ảnh phù hợp với bài học.
- Cho phép cấu hình theo môn học, cấp học, mục tiêu sử dụng và phong cách.
- Hỗ trợ giáo viên chưa có kinh nghiệm viết prompt thông qua mẫu và quy tắc sư phạm.
- Lưu hình ảnh vào thư viện cá nhân và chèn trực tiếp vào slide hiện tại.
- Có cơ chế kiểm tra, cảnh báo và ghi nhận phản hồi về độ chính xác học thuật.
- Giữ kiến trúc mở để có thể thay đổi nhà cung cấp AI mà không ảnh hưởng giao diện.

## 2. Phạm vi chức năng

### 2.1. Tạo ảnh từ mô tả tiếng Việt

Người dùng nhập mô tả tự do hoặc nội dung bài học. Hệ thống chuẩn hóa yêu cầu, tạo prompt hoàn chỉnh và gửi tới dịch vụ sinh ảnh.

Đầu vào tối thiểu:

- Mô tả hình ảnh bằng tiếng Việt.
- Môn học.
- Cấp học.
- Mục đích sử dụng: minh họa, giải thích khái niệm, sơ đồ, bài tập hoặc ảnh nền.

Kết quả gồm ảnh xem trước, prompt đã tối ưu, trạng thái xử lý và các hành động: tạo lại, tạo biến thể, tải xuống, lưu thư viện, chèn vào slide.

### 2.2. Yêu cầu học thuật và sư phạm

Hệ thống bổ sung quy tắc theo từng nhóm nội dung:

- Toán học: hình học rõ nét, ký hiệu thống nhất, không tự thêm số liệu.
- Vật lý: thể hiện đúng chiều lực, vector, hệ quy chiếu và đại lượng.
- Hóa học: ưu tiên sơ đồ/cấu trúc chuẩn; cảnh báo khi ảnh chỉ mang tính minh họa.
- Sinh học: cấu trúc, bộ phận và tỷ lệ được mô tả rõ; nhãn có thể tách khỏi ảnh để giáo viên kiểm tra.
- Lịch sử, Địa lý, Ngữ văn: ưu tiên bối cảnh, kiến trúc, trang phục và yếu tố văn hóa Việt Nam khi nội dung liên quan Việt Nam.
- Nội dung nhạy cảm hoặc không phù hợp lứa tuổi phải bị từ chối hay yêu cầu chỉnh sửa.

Ảnh do AI tạo cần có nhãn nhận biết và thông báo rằng giáo viên phải duyệt trước khi sử dụng trong bài giảng.

### 2.3. Thư viện prompt và bộ quy tắc

- Danh mục prompt theo môn học, cấp học và dạng hình ảnh.
- Tìm kiếm, lọc, xem trước và chọn prompt mẫu.
- Cho phép quản trị viên thêm, sửa, bật/tắt và phiên bản hóa mẫu.
- Tự động ghép prompt từ mô tả người dùng với các tiêu chí đã chọn.
- Hiển thị bản prompt cuối để người dùng có thể chỉnh sửa trước khi tạo ảnh.

### 2.4. Tùy chỉnh hình ảnh

- Cấp học: Tiểu học, THCS, THPT, Đại học/khác.
- Phong cách: sơ đồ, infographic, minh họa phẳng, hoạt hình, hiện thực, tranh lịch sử, tối giản.
- Tỷ lệ: 1:1, 4:3, 16:9, dọc.
- Mức độ chi tiết: đơn giản, vừa, chuyên sâu.
- Có/không có chữ và chú thích; ngôn ngữ chú thích.
- Nội dung cần nhấn mạnh, màu chủ đạo và số lượng đối tượng.
- Tạo biến thể từ ảnh đã có và chỉnh sửa bằng mô tả ở giai đoạn sau MVP.

### 2.5. Xuất và tích hợp

- Tải ảnh PNG/JPEG/WebP.
- Chèn ảnh trực tiếp vào slide đang chọn dưới dạng `SlideElement` loại `image`.
- Lưu ảnh vào thư viện cá nhân để tái sử dụng giữa các dự án.
- Ảnh đã chèn tiếp tục được xuất qua quy trình PPTX/PDF hiện có.
- Tích hợp Google Slides, Canva, tiện ích PowerPoint và API công khai là phạm vi mở rộng, không thuộc MVP.

## 3. Luồng người dùng chính

1. Trong màn hình Editor, giáo viên chọn **Tạo ảnh AI**.
2. Nhập mô tả hoặc chọn một prompt mẫu.
3. Chọn môn học, cấp học, mục đích, phong cách, tỷ lệ và mức chi tiết.
4. Hệ thống tạo và hiển thị prompt tối ưu để giáo viên xác nhận/chỉnh sửa.
5. Người dùng gửi yêu cầu; giao diện hiển thị tiến trình và cho phép hủy.
6. Khi hoàn tất, hệ thống hiển thị ảnh cùng thông tin nguồn AI và cảnh báo kiểm tra học thuật.
7. Giáo viên tải xuống, lưu thư viện, tạo biến thể hoặc chèn ảnh vào slide.
8. Giáo viên có thể đánh giá kết quả và báo lỗi học thuật/văn hóa để cải thiện bộ quy tắc.

## 4. Thiết kế kỹ thuật đề xuất

### 4.1. Kiến trúc

```text
React Editor
    -> EduArt AI REST API (Express)
        -> Prompt Builder + Pedagogy Rules
        -> Safety/Validation
        -> Image Provider Adapter
        -> AI image provider
        -> Image Storage
        -> SQLite metadata
```

Backend phải giữ API key; frontend không gọi trực tiếp nhà cung cấp AI. Tạo lớp `ImageProvider` dùng chung với các hàm `generate`, `getStatus` và `cancel` để có thể thay đổi nhà cung cấp. Tác vụ sinh ảnh nên chạy bất đồng bộ; MVP có thể polling trạng thái, sau đó nâng cấp sang SSE/WebSocket.

### 4.2. Thành phần frontend

- `AIImagePanel`: form tạo ảnh trong Editor.
- `PromptTemplateLibrary`: tìm kiếm/lọc/chọn prompt mẫu.
- `GeneratedImageGallery`: kết quả, lịch sử và thao tác trên ảnh.
- `AcademicReviewNotice`: cảnh báo kiểm tra kiến thức và văn hóa.
- `aiImageService.ts`: gọi API, polling trạng thái, hủy yêu cầu.
- Mở rộng `SlideElement` nếu cần thêm metadata nguồn ảnh, nhưng không lưu API key hoặc prompt nhạy cảm ở slide.

Vị trí tích hợp ưu tiên là panel bên phải của `frontend/src/pages/Editor.tsx`. Khi chèn ảnh, tạo phần tử ảnh theo kiểu dữ liệu hiện có trong `frontend/src/types/index.ts`, căn giữa vùng slide và giữ đúng tỷ lệ.

### 4.3. Thành phần backend

- `routes/aiImageRoutes.js`: khai báo endpoint.
- `controllers/aiImageController.js`: xác thực và chuẩn hóa request/response.
- `services/promptBuilderService.js`: ghép prompt tiếng Việt với quy tắc sư phạm.
- `services/aiImageService.js`: điều phối tác vụ, hạn mức và lưu kết quả.
- `services/providers/<provider>.js`: adapter nhà cung cấp AI.
- `services/imageStorageService.js`: lưu file và sinh URL.
- `middleware/aiRateLimit.js`: giới hạn tần suất, số tác vụ đồng thời và quota.

Không ghi API key, ảnh dạng base64 hoặc toàn bộ nội dung nhạy cảm vào log. Biến môi trường dự kiến: `AI_IMAGE_PROVIDER`, `AI_IMAGE_API_KEY`, `AI_IMAGE_MODEL`, `AI_IMAGE_MAX_CONCURRENT`, `AI_IMAGE_DAILY_QUOTA`.

### 4.4. Mô hình dữ liệu

#### `prompt_templates`

| Trường | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `id` | TEXT | Khóa chính |
| `name` | TEXT | Tên mẫu |
| `subject` | TEXT | Môn học |
| `grade_level` | TEXT | Cấp học |
| `image_type` | TEXT | Loại hình ảnh |
| `template_text` | TEXT | Nội dung prompt có biến |
| `pedagogy_rules` | TEXT/JSON | Quy tắc bổ sung |
| `is_active` | INTEGER | Trạng thái sử dụng |
| `version` | INTEGER | Phiên bản |
| `created_at`, `updated_at` | TEXT | Thời gian |

#### `ai_image_jobs`

| Trường | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `id` | TEXT | Mã tác vụ |
| `user_id`, `project_id`, `slide_id` | TEXT | Chủ sở hữu và ngữ cảnh |
| `source_prompt` | TEXT | Mô tả ban đầu |
| `optimized_prompt` | TEXT | Prompt đã tối ưu |
| `options` | TEXT/JSON | Môn, cấp, phong cách, tỷ lệ... |
| `provider`, `model` | TEXT | Nguồn sinh ảnh |
| `status` | TEXT | queued/processing/completed/failed/cancelled |
| `error_code` | TEXT | Mã lỗi an toàn cho client |
| `created_at`, `completed_at` | TEXT | Thời gian |

#### `generated_images`

| Trường | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `id`, `job_id`, `user_id` | TEXT | Định danh và chủ sở hữu |
| `storage_url`, `thumbnail_url` | TEXT | URL file và thumbnail |
| `width`, `height`, `mime_type`, `file_size` | INTEGER/TEXT | Thuộc tính file |
| `is_favorite` | INTEGER | Đánh dấu yêu thích |
| `moderation_status` | TEXT | Trạng thái kiểm duyệt |
| `created_at`, `deleted_at` | TEXT | Vòng đời dữ liệu |

#### `ai_image_feedback`

Lưu `image_id`, `user_id`, loại phản hồi (đúng/sai học thuật, sai văn hóa, chất lượng thấp, khác), ghi chú và thời gian. Không tự dùng dữ liệu này để huấn luyện nếu chưa có sự đồng ý phù hợp.

### 4.5. API dự kiến

| Method | Endpoint | Mục đích |
| --- | --- | --- |
| `POST` | `/api/ai-images/jobs` | Tạo tác vụ sinh ảnh |
| `GET` | `/api/ai-images/jobs/:id` | Lấy trạng thái/kết quả |
| `POST` | `/api/ai-images/jobs/:id/cancel` | Hủy tác vụ |
| `POST` | `/api/ai-images/:id/variations` | Tạo biến thể |
| `GET` | `/api/ai-images` | Lấy thư viện ảnh cá nhân |
| `DELETE` | `/api/ai-images/:id` | Xóa mềm ảnh |
| `POST` | `/api/ai-images/:id/feedback` | Gửi phản hồi |
| `GET` | `/api/prompt-templates` | Lọc và lấy prompt mẫu |
| `POST` | `/api/prompts/preview` | Xem prompt tối ưu trước khi sinh ảnh |

Tất cả endpoint tạo/xóa/đánh giá phải dùng middleware xác thực hiện có và kiểm tra quyền sở hữu dự án. Request phải được giới hạn độ dài, danh sách lựa chọn hợp lệ và kích thước đầu ra.

## 5. Kế hoạch triển khai

### Giai đoạn 0 — Khảo sát và quyết định kỹ thuật

- Chọn nhà cung cấp AI theo chất lượng tiếng Việt, chi phí, độ trễ, quyền sử dụng ảnh và chính sách dữ liệu.
- Chọn nơi lưu ảnh: local cho phát triển; object storage cho production.
- Xác định quota theo người dùng và cơ chế theo dõi chi phí.
- Chuẩn hóa taxonomy môn học, cấp học, phong cách và loại hình ảnh.
- Tạo bộ ca kiểm thử chuẩn, đặc biệt cho nội dung Việt Nam.

**Đầu ra:** ADR lựa chọn provider/storage, cấu hình môi trường và bộ dữ liệu kiểm thử.

### Giai đoạn 1 — MVP tạo ảnh và chèn vào slide

- Tạo schema và migration cho tác vụ/ảnh.
- Xây dựng provider adapter, prompt builder cơ bản và API tạo/lấy trạng thái.
- Thêm panel tạo ảnh trong Editor với mô tả, môn, cấp, phong cách, tỷ lệ.
- Hiển thị tiến trình, lỗi và kết quả.
- Lưu file, lưu metadata, tải xuống và chèn ảnh vào slide.
- Áp dụng xác thực, quyền sở hữu, quota và kiểm tra nội dung đầu vào.

**Hoàn thành khi:** giáo viên có thể tạo ảnh từ tiếng Việt, thấy kết quả, tải xuống và chèn vào slide; ảnh vẫn xuất được trong PPTX/PDF.

### Giai đoạn 2 — Prompt mẫu và quy tắc sư phạm

- Tạo schema, seed và API cho prompt template.
- Xây dựng thư viện prompt có tìm kiếm/lọc.
- Tạo bộ quy tắc theo môn/cấp và màn hình xem prompt tối ưu.
- Bổ sung tiêu chí văn hóa Việt Nam và cảnh báo kiểm tra học thuật.
- Thêm phản hồi chất lượng/khiếu nại sai kiến thức.

**Hoàn thành khi:** người dùng không cần tự viết prompt phức tạp và có thể kiểm tra prompt trước khi tạo.

### Giai đoạn 3 — Thư viện ảnh và tùy chỉnh nâng cao

- Thư viện cá nhân, phân trang, yêu thích, tìm kiếm và xóa mềm.
- Tạo lại, tạo biến thể và chỉnh sửa ảnh bằng mô tả.
- Thumbnail, tối ưu định dạng/kích thước và dọn file không còn tham chiếu.
- Theo dõi lịch sử sử dụng, chi phí và tỷ lệ lỗi.

### Giai đoạn 4 — Tích hợp bên ngoài và API tổ chức

- Tích hợp Google Slides/Canva/PowerPoint sau khi đánh giá API và quyền truy cập.
- API key theo trường/doanh nghiệp, quota theo tổ chức, nhật ký kiểm toán.
- Dashboard quản trị prompt, chi phí, lỗi và nội dung bị báo cáo.

## 6. Kiểm thử và tiêu chí chất lượng

### Kiểm thử chức năng

- Unit test cho prompt builder, validation, quota và mapping trạng thái provider.
- Integration test API với provider giả lập; không gọi dịch vụ trả phí trong CI.
- Component test cho form, tiến trình, lỗi và thao tác chèn ảnh.
- E2E: tạo ảnh → lưu thư viện → chèn slide → xuất PPTX/PDF.

### Tiêu chí nghiệm thu MVP

- Người dùng đăng nhập mới được tạo ảnh và chỉ thấy ảnh của mình.
- Mô tả tiếng Việt hợp lệ tạo được tác vụ và trả về trạng thái rõ ràng.
- Không tạo trùng tác vụ khi người dùng nhấn nút nhiều lần (idempotency key).
- Lỗi provider, timeout và hết quota có thông báo dễ hiểu, có thể thử lại an toàn.
- Ảnh chèn vào slide không méo, có thể di chuyển/thay đổi kích thước và được lưu.
- Xuất PDF/PPTX chứa đúng ảnh đã chèn.
- API key không xuất hiện trong bundle frontend, response hoặc log.
- Nội dung bị cấm được chặn và mọi ảnh AI đều có thông tin nguồn/cảnh báo kiểm tra.

### Chỉ số theo dõi

- Tỷ lệ tác vụ thành công, thời gian tạo ảnh P50/P95.
- Chi phí trung bình trên một ảnh và trên một người dùng.
- Tỷ lệ ảnh được chèn/tải xuống so với số ảnh được tạo.
- Tỷ lệ tạo lại, báo lỗi học thuật và báo lỗi văn hóa.
- Số tác vụ bị chặn bởi moderation/quota.

## 7. Rủi ro và biện pháp giảm thiểu

| Rủi ro | Biện pháp |
| --- | --- |
| Ảnh sai kiến thức | Quy tắc theo môn, cảnh báo bắt buộc, phản hồi và bộ kiểm thử chuyên gia |
| Sai bối cảnh Việt Nam | Prompt ràng buộc văn hóa, bộ ảnh chuẩn và giáo viên duyệt trước khi dùng |
| AI tạo chữ/ký hiệu sai | Mặc định hạn chế chữ trong ảnh; bổ sung nhãn bằng phần tử text của slide |
| Chi phí vượt kiểm soát | Quota, giới hạn đồng thời, theo dõi usage, cache/idempotency |
| Độ trễ hoặc provider lỗi | Tác vụ bất đồng bộ, retry có giới hạn, timeout và adapter thay provider |
| Rò rỉ dữ liệu/API key | Gọi AI từ backend, lọc log, mã hóa secret và chính sách lưu/xóa dữ liệu |
| Bản quyền/quyền sử dụng | Hiển thị nguồn, lưu metadata model/provider, kiểm tra điều khoản trước production |
| File ảnh làm tăng dung lượng | Object storage, thumbnail, giới hạn kích thước và chính sách retention |

## 8. Thứ tự ưu tiên backlog

| Ưu tiên | Hạng mục |
| --- | --- |
| P0 | Provider adapter, tạo tác vụ, trạng thái, lưu ảnh, xác thực và quota |
| P0 | Form tạo ảnh tiếng Việt và chèn ảnh vào slide |
| P0 | Validation, moderation, xử lý lỗi và cảnh báo kiểm tra học thuật |
| P1 | Prompt builder theo môn/cấp và thư viện prompt mẫu |
| P1 | Thư viện ảnh cá nhân, tải xuống, yêu thích và xóa mềm |
| P1 | Feedback sai học thuật/văn hóa và dashboard chỉ số cơ bản |
| P2 | Tạo biến thể, chỉnh sửa ảnh và quản trị prompt |
| P2 | API tổ chức và tích hợp Google Slides/Canva/PowerPoint |

## 9. Việc cần quyết định trước khi lập trình

1. Nhà cung cấp/model sinh ảnh và ngân sách tối đa mỗi tháng.
2. Object storage dùng trong production và thời hạn lưu ảnh.
3. Số ảnh mỗi yêu cầu, quota ngày/tháng và quyền dành cho từng vai trò.
4. Danh sách môn học/cấp học chính thức cho phiên bản đầu.
5. Quy trình chuyên gia duyệt bộ prompt và đánh giá độ chính xác học thuật.
6. Chính sách quyền riêng tư, bản quyền và việc sử dụng phản hồi người dùng.


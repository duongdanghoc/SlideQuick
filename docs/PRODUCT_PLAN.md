# PRODUCT PLAN — EDUART AI PROTOTYPE

## 1. Tổng quan

EduArt AI là chức năng mở rộng cho trình biên tập slide SlideQuick, giúp giáo viên tạo hình ảnh giáo dục từ mô tả tiếng Việt và chèn trực tiếp kết quả vào bài giảng.

Phiên bản này là **prototype phục vụ capstone**, không phải sản phẩm production hoàn chỉnh. Prototype tập trung chứng minh một trải nghiệm xuyên suốt với hai môn đại diện:

- **Lịch sử** — đại diện nhóm môn xã hội, nhấn mạnh bối cảnh, trang phục, kiến trúc và văn hóa Việt Nam.
- **Vật lý** — đại diện nhóm môn tự nhiên, nhấn mạnh hiện tượng, sơ đồ lực, hướng vector và bố cục minh họa khoa học.

## 2. Mục tiêu sản phẩm

Prototype phải chứng minh được luồng giá trị cốt lõi:

> Giáo viên mô tả bằng tiếng Việt → EduArt hiểu môn học và cấp học → tự áp dụng prompt/rule phù hợp → sinh hình ảnh giáo dục → giáo viên kiểm tra → chèn ảnh vào slide.

### 2.1. Mục tiêu bắt buộc

- Người dùng không cần biết kỹ thuật viết prompt.
- Prompt được tối ưu tự động theo môn học, cấp học, loại hình ảnh và phong cách.
- Kết quả cho thấy rõ rule Lịch sử hoặc Vật lý nào đã được áp dụng.
- Ảnh có thể tải xuống hoặc chèn vào slide hiện tại.
- Ảnh chèn vào slide giữ đúng tỷ lệ, có thể di chuyển, thay đổi kích thước, lưu và xuất cùng slide.
- API key của nhà cung cấp AI chỉ tồn tại ở backend.
- Kiến trúc có lớp `ImageProvider` để có thể đổi nhà cung cấp AI.

### 2.2. Ngoài phạm vi prototype

- Hỗ trợ đầy đủ Toán, Hóa học, Sinh học, Địa lý và Ngữ văn.
- AI tự chấm điểm hoặc cam kết độ chính xác học thuật.
- Dashboard quản trị, analytics và hệ thống feedback chuyên sâu.
- Tạo biến thể, chỉnh sửa ảnh bằng prompt và xử lý ảnh nâng cao.
- Thư viện ảnh cá nhân hoàn chỉnh với yêu thích, tìm kiếm, phân trang.
- CMS, CRUD hoặc versioning cho prompt template.
- API tổ chức và tích hợp Google Slides, Canva hoặc PowerPoint add-in.
- Hạ tầng production quy mô lớn, thanh toán và quota theo gói.

## 3. Người dùng và nhu cầu

### Persona chính

Giáo viên phổ thông cần hình minh họa nhanh cho bài giảng nhưng không có kỹ năng thiết kế hoặc prompt engineering.

### Job to be done

> Khi chuẩn bị slide bài giảng, tôi muốn mô tả hình ảnh bằng tiếng Việt và nhận được hình minh họa phù hợp với môn học, lứa tuổi và bối cảnh để có thể kiểm tra rồi chèn ngay vào slide.

### Pain points được xử lý

- Không biết viết prompt chi tiết.
- Ảnh AI quốc tế dễ sai bối cảnh Việt Nam.
- Hình khoa học có thể sinh chữ, ký hiệu hoặc chiều vector sai.
- Phải tải ảnh, quản lý file rồi chèn thủ công vào slide.

## 4. Phạm vi chức năng

### 4.1. Form tạo ảnh cơ bản

Các trường bắt buộc:

- Mô tả bằng tiếng Việt.
- Môn học: `history` hoặc `physics`.
- Cấp học: `primary`, `secondary` hoặc `high_school`.
- Loại hình ảnh phụ thuộc môn học.
- Phong cách.
- Tỷ lệ ảnh: `1:1`, `4:3`, `16:9` hoặc `3:4`.

Basic mode chỉ hiển thị các trường trên và nút **Tạo ảnh**. Hệ thống tự xây prompt ở backend.

Advanced settings có mục **Xem prompt AI đã tối ưu**. Người dùng có thể xem và chỉnh prompt, nhưng đây không phải bước bắt buộc.

### 4.2. Loại hình ảnh

**Lịch sử**

- Tái hiện sự kiện lịch sử.
- Đời sống Việt Nam xưa.
- Nhân vật trong bối cảnh lịch sử.
- Kiến trúc hoặc không gian lịch sử.

**Vật lý**

- Minh họa hiện tượng.
- Sơ đồ lực.
- Mô hình thí nghiệm.
- Minh họa ứng dụng thực tế.

### 4.3. Prompt mẫu

Prototype dùng 6–8 prompt card được cấu hình tĩnh trong mã nguồn hoặc file JSON/TypeScript. Không dùng database hoặc màn hình quản trị prompt.

Khi chọn một card, hệ thống điền sẵn môn học, loại hình ảnh và một mô tả gợi ý; giáo viên có thể sửa trước khi tạo.

### 4.4. Prompt Builder và subject rules

Prompt Builder nhận dữ liệu có cấu trúc và tạo prompt cuối cùng theo thứ tự:

1. Mô tả nội dung của người dùng.
2. Ngữ cảnh môn học.
3. Cấp học và mức độ trực quan.
4. Loại hình ảnh và phong cách.
5. Rule riêng của Lịch sử hoặc Vật lý.
6. Ràng buộc chung: bố cục rõ, không watermark, hạn chế chữ trong ảnh.
7. Yêu cầu tỷ lệ ảnh.

Rule phải được trả về dưới dạng danh sách `appliedRules` để UI giải thích hệ thống đã áp dụng điều gì.

### 4.5. Quy tắc Lịch sử

- Nếu nội dung liên quan Việt Nam, ưu tiên bối cảnh, trang phục và kiến trúc phù hợp vùng miền, thời kỳ được mô tả.
- Không trộn chi tiết của các thời kỳ khác nhau.
- Không tự thêm biểu tượng, nhân vật hoặc sự kiện không có trong yêu cầu.
- Không tuyên bố ảnh là tư liệu lịch sử xác thực.
- Với nội dung chưa đủ mốc thời gian hoặc địa điểm, prompt dùng mô tả trung tính thay vì tự bịa chi tiết.

### 4.6. Quy tắc Vật lý

- Với sơ đồ lực, nêu rõ vật thể, chiều và điểm đặt của vector nếu người dùng đã cung cấp.
- Không tự tạo số liệu hoặc công thức không có trong yêu cầu.
- Hạn chế AI sinh chữ, công thức và ký hiệu trực tiếp trong ảnh.
- Bố cục đơn giản, tập trung vào hiện tượng chính và phù hợp cấp học.
- Nhãn hoặc công thức cần độ chính xác cao nên được bổ sung bằng `text element` của slide ở bước sau.

### 4.7. Kết quả và hành động

Sau khi hoàn tất, giao diện hiển thị:

- Ảnh xem trước.
- Trạng thái tác vụ.
- Prompt tối ưu có thể mở xem.
- Danh sách `appliedRules`.
- Thông tin model/provider ở mức cần thiết.
- Cảnh báo: **Ảnh do AI tạo. Giáo viên cần kiểm tra độ chính xác trước khi sử dụng trong lớp học.**
- Hành động: **Tạo lại**, **Tải xuống**, **Chèn vào slide**.

`Tạo lại` tạo một job mới với cùng input; không phải image-to-image variation.

### 4.8. Tích hợp slide

Khi chọn **Chèn vào slide**:

- Tạo `SlideElement` loại `image` theo type hiện có của dự án.
- Căn ảnh vào giữa vùng nhìn thấy của slide.
- Scale ảnh để vừa khung nhưng không crop và không méo.
- Cho phép di chuyển và resize bằng editor hiện có.
- Lưu cùng project và xuất được trong PDF/PPTX nếu pipeline hiện tại đã hỗ trợ ảnh.

## 5. Luồng người dùng

1. Giáo viên mở Editor và chọn **Tạo ảnh AI**.
2. Nhập mô tả hoặc chọn prompt card.
3. Chọn môn, cấp học, loại hình ảnh, phong cách và tỷ lệ.
4. Nhấn **Tạo ảnh**; không bắt buộc xác nhận prompt.
5. UI hiển thị trạng thái `queued`/`processing` và polling kết quả.
6. Khi hoàn tất, UI hiển thị ảnh, rule đã áp dụng và cảnh báo học thuật.
7. Giáo viên tạo lại, tải xuống hoặc chèn ảnh vào slide.
8. Ảnh sau khi chèn có thể được chỉnh vị trí/kích thước, lưu và xuất cùng bài trình chiếu.

## 6. Kiến trúc đề xuất

```text
React Editor
  → AIImagePanel
  → EduArt REST API (Express)
      → Request Validation / Safety
      → PromptBuilder
          → HistoryRules | PhysicsRules
      → ImageProvider Adapter
          → Configured AI Provider
      → Image Storage
      → SQLite metadata (jobs + images)
```

### Nguyên tắc kiến trúc

- Frontend không gọi trực tiếp provider và không nhận API key.
- Controller không chứa logic tạo prompt hoặc logic riêng của provider.
- `ImageProvider` là interface ổn định với `generate()` và `getStatus()`; `cancel()` chỉ thêm khi provider thực sự hỗ trợ.
- API dùng job bất đồng bộ và frontend polling để dễ mở rộng.
- CI và test dùng fake provider, không gọi dịch vụ trả phí.
- Prompt template lưu tĩnh; database prototype chỉ lưu job và ảnh.

## 7. Thành phần phần mềm

### Frontend

- `AIImagePanel`: form và trạng thái toàn bộ feature.
- `PromptTemplateCards`: 6–8 prompt card tĩnh.
- `AdvancedPromptPreview`: xem/chỉnh prompt tối ưu tùy chọn.
- `GeneratedImagePreview`: ảnh, actions và error state.
- `AppliedRulesPanel`: rule đã áp dụng và cảnh báo.
- `aiImageService`: gọi API và polling.
- Hàm adapter chèn kết quả vào `SlideElement` hiện có.

Vị trí tích hợp ưu tiên là panel bên phải của Editor. Tên đường dẫn cụ thể phải được xác nhận sau khi agent khảo sát repository; không tạo cấu trúc frontend thứ hai nếu dự án đã có pattern tương đương.

### Backend

- Route/controller cho `/api/ai-images`.
- Validation schema và error mapping.
- `promptBuilderService` thuần, có unit test.
- `historyRules` và `physicsRules` độc lập.
- `ImageProvider` interface, fake provider và một provider thật.
- `aiImageService` điều phối job, provider và storage.
- `imageStorageService` lưu file và trả URL hợp lệ.

## 8. Dữ liệu prototype

### `ai_image_jobs`

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | TEXT | Mã job |
| `user_id` | TEXT | Chủ sở hữu |
| `project_id` | TEXT nullable | Project liên quan |
| `slide_id` | TEXT nullable | Slide đang mở |
| `source_prompt` | TEXT | Mô tả ban đầu |
| `optimized_prompt` | TEXT | Prompt gửi provider |
| `options` | JSON/TEXT | Subject, grade, image type, style, ratio |
| `applied_rules` | JSON/TEXT | Danh sách rule hiển thị cho người dùng |
| `provider` | TEXT | Provider sử dụng |
| `model` | TEXT | Model sử dụng |
| `status` | TEXT | queued/processing/completed/failed |
| `error_code` | TEXT nullable | Mã lỗi an toàn |
| `created_at` | TEXT | Thời gian tạo |
| `completed_at` | TEXT nullable | Thời gian hoàn tất |

### `generated_images`

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | TEXT | Mã ảnh |
| `job_id` | TEXT | Job nguồn |
| `user_id` | TEXT | Chủ sở hữu |
| `storage_url` | TEXT | URL ảnh |
| `width` | INTEGER | Chiều rộng |
| `height` | INTEGER | Chiều cao |
| `mime_type` | TEXT | MIME type |
| `created_at` | TEXT | Thời gian tạo |

## 9. API prototype

| Method | Endpoint | Mục đích |
|---|---|---|
| `POST` | `/api/ai-images/jobs` | Tạo job sinh ảnh |
| `GET` | `/api/ai-images/jobs/:jobId` | Lấy trạng thái và kết quả |
| `GET` | `/api/ai-images` | Danh sách ảnh gần đây, chỉ làm nếu cần demo |
| `DELETE` | `/api/ai-images/:imageId` | Xóa ảnh, chỉ làm nếu có màn lịch sử |

P0 chỉ bắt buộc hai endpoint job. API preview prompt riêng không bắt buộc; backend có thể trả `optimizedPrompt` ngay trong response tạo job. Nếu provider nhanh và đồng bộ, service vẫn phải giữ contract job để UI không phụ thuộc provider.

## 10. Lộ trình triển khai

### Milestone 1 — AI Generation Core

- Khảo sát cấu trúc repository và xác nhận điểm tích hợp.
- Tạo `ImageProvider` interface và fake provider.
- Tạo schema job/image, service điều phối và hai API job.
- Tích hợp một provider thật qua biến môi trường.

**Hoàn thành khi:** API nhận request hợp lệ và trả được ảnh qua fake provider; provider thật chạy trong môi trường phát triển khi có API key.

### Milestone 2 — EduArt Intelligence

- Tạo taxonomy và prompt template tĩnh.
- Xây `PromptBuilder`, `HistoryRules` và `PhysicsRules`.
- Trả `optimizedPrompt` và `appliedRules` trong API.
- Thêm validation, moderation cơ bản và cảnh báo.

**Hoàn thành khi:** cùng một mô tả nhưng chọn Lịch sử/Vật lý tạo prompt khác nhau và unit test chứng minh rule đúng được áp dụng.

### Milestone 3 — Editor Integration

- Tạo AI Image Panel, prompt card và advanced prompt preview.
- Thêm loading, polling, error và result state.
- Thêm tải xuống và chèn ảnh vào slide.
- Kiểm tra save và export.

**Hoàn thành khi:** người dùng đi được toàn bộ flow từ mô tả tiếng Việt đến ảnh nằm trong slide.

### Milestone 4 — Demo Polish

- Hoàn thiện 6–8 scenario mẫu.
- Thêm empty/loading/error/timeout states và chống double submit.
- Kiểm thử E2E hai kịch bản Lịch sử và Vật lý.
- Chuẩn bị dữ liệu demo và phương án fake provider khi mạng/provider lỗi.

**Hoàn thành khi:** demo ổn định, có thể chạy lại và không phụ thuộc tuyệt đối vào dịch vụ trả phí.

## 11. Tiêu chí nghiệm thu prototype

- Form chỉ cho phép taxonomy hợp lệ và mô tả trong giới hạn độ dài.
- Người dùng nhấn nhiều lần không tạo job trùng ngoài ý muốn.
- Basic mode tạo ảnh mà không bắt người dùng đọc prompt.
- Advanced mode hiển thị prompt tối ưu và cho phép chỉnh trước khi gửi.
- Request Lịch sử trả rule liên quan bối cảnh/thời kỳ; request Vật lý trả rule liên quan hiện tượng/vector/số liệu.
- API không trả API key, raw provider error hoặc thông tin nhạy cảm.
- Loading, timeout, provider error và nội dung bị từ chối có thông báo dễ hiểu.
- Ảnh chèn vào slide không méo, nằm trong canvas và chỉnh sửa được.
- Sau khi lưu/mở lại, ảnh vẫn tồn tại; export PDF/PPTX có ảnh nếu pipeline hiện tại hỗ trợ image element.
- Mọi ảnh kết quả đều có cảnh báo cần giáo viên kiểm tra.

## 12. Kiểm thử

- Unit test: Prompt Builder, subject rules, validation, provider status mapping, fit-to-slide calculation.
- Integration test: API với fake provider, quyền sở hữu job, lỗi timeout/provider.
- Component test: form, template card, loading, result, error, insert action.
- E2E: một scenario Lịch sử và một scenario Vật lý từ generate đến save/export.
- Không gọi API trả phí trong CI.

## 13. Rủi ro và giảm thiểu

| Rủi ro | Biện pháp trong prototype |
|---|---|
| Ảnh sai kiến thức | Rule theo môn, cảnh báo bắt buộc, giáo viên duyệt |
| Sai bối cảnh Việt Nam | History rules, prompt mẫu có thời kỳ/địa điểm, scenario test |
| Chữ/ký hiệu sai | Mặc định yêu cầu ảnh ít chữ; dùng text element cho nhãn chính xác |
| Provider lỗi hoặc chậm | Job + polling, timeout, retry thủ công, fake provider cho demo |
| Chi phí | Một ảnh mỗi request, rate limit cơ bản, không gọi provider trong test |
| Lộ API key | Chỉ gọi provider từ backend, lọc log và error response |
| Agents code lệch nhau | Dùng API contract, feature spec, acceptance criteria và task files đi kèm |

## 14. Quyết định cần chốt trước khi code provider thật

1. Provider/model dùng trong buổi demo.
2. Giới hạn chi phí hoặc số request/ngày trong môi trường demo.
3. Cơ chế xác thực hiện có của SlideQuick được tái sử dụng hay prototype chạy một user giả lập.
4. Nơi lưu ảnh trong demo: local static storage hay object storage đã có.
5. Các loại `SlideElement` và pipeline save/export hiện tại hỗ trợ ảnh như thế nào.

Các quyết định này không chặn việc triển khai Prompt Builder, fake provider, UI states hoặc test.

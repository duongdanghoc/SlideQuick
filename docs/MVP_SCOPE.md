# MVP Scope

## North-star flow

```text
Vietnamese description
→ subject/grade/image type/style/ratio
→ optimized prompt + applied rules
→ generated image
→ teacher review
→ insert into slide
```

## P0 — phải hoàn thành

- Hai môn: Lịch sử và Vật lý.
- Basic form với mô tả, môn, cấp, loại ảnh, phong cách, tỷ lệ.
- 6–8 prompt card tĩnh.
- Prompt Builder có History Rules và Physics Rules.
- Image Provider adapter, fake provider và một provider thật.
- Job API: create + get status.
- Loading, completed, failed và timeout UI.
- Hiển thị optimized prompt, applied rules và cảnh báo học thuật.
- Tạo lại bằng cùng input.
- Tải ảnh.
- Chèn ảnh vào slide, giữ tỷ lệ, save và export theo khả năng hiện có.
- Unit, integration và hai E2E demo scenarios.

## P1 — chỉ làm sau P0

- Danh sách ảnh gần đây tối giản.
- Xóa ảnh gần đây.
- Nút hủy job nếu provider và backend thực sự hỗ trợ.
- Overlay một số label/công thức bằng text element của slide.

## Không làm trong prototype

- Môn học ngoài Lịch sử/Vật lý.
- Prompt CMS/admin/versioning.
- AI academic score hoặc validator tuyên bố ảnh chính xác.
- Feedback database và analytics dashboard.
- Image variation hoặc image-to-image editing.
- Favorite/search/pagination cho thư viện ảnh.
- Google Slides, Canva, PowerPoint add-in hoặc public API.
- Organization account, billing, plan/quota UI.

## Scope guard

Một change bị coi là ngoài scope khi:

- thêm bảng database ngoài `ai_image_jobs` và `generated_images` mà không cần cho P0;
- thêm endpoint ngoài contract chỉ để “dùng sau”;
- thêm taxonomy/môn học không có acceptance test;
- tái cấu trúc editor hoặc backend không cần thiết cho feature;
- thay đổi pipeline export hiện có ngoài phần cần để hỗ trợ image element.

Khi gặp nhu cầu ngoài scope, agent ghi vào `Follow-ups` trong báo cáo bàn giao, không tự triển khai.

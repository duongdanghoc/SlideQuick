# Task 06 — Slide Integration

## Goal

Chuyển generated image thành image element tương thích editor, save và export hiện có.

## Read

- `ARCHITECTURE.md`
- `features/ai-image/FEATURE.md`
- `features/ai-image/ACCEPTANCE.md`
- `CODING_RULES.md`

## Work

1. Xác định canonical `SlideElement` image type và editor update action.
2. Viết hàm pure tính vị trí/kích thước fit-center theo slide bounds và image dimensions.
3. Map image metadata sang element hiện có; chỉ thêm optional metadata nếu thực sự cần.
4. Nối `onInsert` từ preview vào current selected slide.
5. Verify move/resize, save/reload và export.
6. Thêm test cho landscape, portrait, square và missing dimensions fallback.

## Rules

- Không crop và không stretch.
- Có margin hợp lý; element luôn nằm trong slide.
- Insert nhiều lần tạo ID mới.
- Không lưu API key hoặc provider raw payload trong slide.
- Nếu export pipeline không hỗ trợ remote URL, dùng cơ chế asset hiện có thay vì hack riêng.

## Done when

- AC-09 và AC-10 được verify hoặc blocker export được mô tả bằng bằng chứng cụ thể.
- Fit calculation có unit test.
- Không tạo type/editor state song song.

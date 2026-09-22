# Task 05 — Result Preview and Review

## Goal

Hiển thị kết quả rõ ràng, giải thích applied rules và cung cấp actions tải xuống/tạo lại.

## Read

- `features/ai-image/FEATURE.md`
- `features/ai-image/UI.md`
- `features/ai-image/ACCEPTANCE.md`
- `CODING_RULES.md`

## Work

1. Tạo preview dùng contain, có image loading/error state.
2. Hiển thị optimized prompt trong vùng collapse.
3. Hiển thị applied rules theo label trả từ API.
4. Hiển thị educational notice bắt buộc.
5. Tạo download action an toàn theo URL response.
6. Tạo regenerate action dùng input cũ và idempotency key mới.
7. Chuẩn bị `onInsert(image)` callback cho Task 06.

## Do not

- Tuyên bố ảnh chính xác hoặc hiển thị accuracy percentage.
- Xây variation/image editing.
- Xây gallery/history hoàn chỉnh.

## Done when

- Completed response render đủ ảnh, rules, notice và actions.
- Image load failure không làm mất metadata/actions còn dùng được.
- Regenerate tạo job mới.
- Download dùng filename/MIME hợp lý và theo security pattern hiện có.

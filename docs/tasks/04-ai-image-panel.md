# Task 04 — AI Image Panel and Client

## Goal

Tạo form cơ bản, prompt cards, API client và polling state trong Editor.

## Read

- `features/ai-image/FEATURE.md`
- `features/ai-image/UI.md`
- `API_CONTRACT.md`
- `CODING_RULES.md`

## Work

1. Xác định điểm tích hợp panel theo pattern Editor hiện có.
2. Tạo form với validation và dependent image type.
3. Tạo prompt cards từ config tĩnh.
4. Tạo API client type-safe.
5. Tạo state machine/hook cho submit + polling + cleanup.
6. Thêm Advanced prompt preview/edit mà không chặn Basic flow.
7. Render empty, submitting, processing, failed states.

## Do not

- Gọi provider trực tiếp.
- Duplicate taxonomy không có nguồn chung.
- Triển khai result actions/slide insert ngoài callback cần thiết.
- Làm search/filter cho prompt cards.

## Done when

- Form invalid không gọi API.
- Double submit bị ngăn; mỗi retry/regenerate có key mới.
- Polling dừng khi terminal/unmount/timeout.
- User input không mất khi API lỗi.
- Component/hook tests liên quan pass.

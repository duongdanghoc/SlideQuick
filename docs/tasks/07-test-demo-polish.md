# Task 07 — Test and Demo Polish

## Goal

Đảm bảo vertical slice ổn định cho demo với Lịch sử và Vật lý, kể cả khi provider thật lỗi.

## Read

- Toàn bộ `features/ai-image/`
- `MVP_SCOPE.md`
- `CODING_RULES.md`

## Work

1. Audit từng acceptance criterion và ghi test/verification tương ứng.
2. Thêm E2E cho hai demo scenarios chuẩn.
3. Verify loading, timeout, validation, provider failure, image load error và insert failure.
4. Verify keyboard/label/status accessibility cơ bản.
5. Chuẩn bị fake-provider demo mode và fixture có kích thước hợp lệ.
6. Kiểm tra secret/log/bundle.
7. Chạy lint, typecheck, unit, integration, E2E và build theo repo.
8. Ghi demo runbook ngắn nếu repository chưa có.

## Do not

- Mở rộng scope để “polish” bằng feature mới.
- Phụ thuộc provider thật cho E2E CI.
- Bỏ qua lỗi bằng cách disable test/typecheck.

## Done when

- Hai scenario chạy end-to-end bằng fake provider.
- Provider thật được smoke-test thủ công nếu credential có sẵn; nếu không, ghi rõ chưa verify.
- Không có P0 acceptance criterion chưa có kết quả.
- Build chạy được theo hướng dẫn bàn giao.

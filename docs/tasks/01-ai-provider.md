# Task 01 — Repository Reconnaissance and Image Provider

## Goal

Xác nhận kiến trúc thực tế của SlideQuick và tạo provider abstraction có fake implementation để các task sau không phụ thuộc dịch vụ trả phí.

## Read

- `ARCHITECTURE.md`
- `API_CONTRACT.md`
- `CODING_RULES.md`

## Work

1. Khảo sát frontend/backend, scripts, auth, database, editor types, save/export.
2. Ghi mapping đường dẫn thực tế vào báo cáo; cập nhật docs nếu giả định quan trọng sai.
3. Tạo core types chung theo convention hiện có.
4. Tạo `ImageProvider` interface và normalized result/error.
5. Tạo deterministic fake provider với ảnh fixture/local URL hợp lệ.
6. Tạo provider factory chọn qua environment.
7. Nếu provider đã được quyết định, thêm adapter thật tối thiểu; nếu chưa, ghi follow-up và không hardcode.

## Do not

- Xây UI hoặc Prompt Builder chi tiết.
- Gọi provider thật trong test.
- Thêm nhiều provider “để dự phòng”.

## Deliverables

- Provider interface/types.
- Fake provider + fixture.
- Provider factory/config validation.
- Unit tests cho mapping success/failure/status.
- Repo mapping trong handoff.

## Done when

- App/test có thể chọn fake provider không cần API key.
- Fake provider trả output đúng normalized contract.
- Provider error không lộ raw payload ra ngoài service boundary.
- Test/typecheck/lint liên quan pass.

# EduArt AI — Agent Documentation Layer

Bộ tài liệu này chuyển Product Plan thành contract có thể giao trực tiếp cho coding agents.

## Thứ tự đọc bắt buộc

1. `PRODUCT_PLAN.md` — mục tiêu và phạm vi sản phẩm.
2. `MVP_SCOPE.md` — P0/P1 và những phần không được tự ý mở rộng.
3. `ARCHITECTURE.md` — ranh giới module và dependency.
4. `API_CONTRACT.md` — request/response/error contract.
5. `CODING_RULES.md` — quy tắc khi sửa repository.
6. `features/ai-image/*` — hành vi feature, UI, prompt, data và acceptance.
7. Một file duy nhất trong `tasks/` tương ứng công việc được giao.

## Cách giao task cho agent

```text
Implement tasks/02-prompt-builder.md.

Read and follow:
- PRODUCT_PLAN.md
- ARCHITECTURE.md
- API_CONTRACT.md
- CODING_RULES.md
- features/ai-image/PROMPT_RULES.md

Do not implement tasks outside the assigned file.
Run required tests and report changed files, test results, and blockers.
```

## Nguyên tắc phối hợp

- Mỗi agent chỉ sửa phạm vi file/module của task được giao.
- Contract thay đổi phải cập nhật tài liệu trước hoặc trong cùng change.
- Không tự thêm feature vì “sẽ cần sau này”.
- Task phụ thuộc chỉ bắt đầu khi contract của task trước đã ổn định.
- Nếu repository khác đường dẫn gợi ý, agent map sang pattern hiện có và ghi lại; không dựng kiến trúc song song.

## Dependency graph

```text
01 Repository reconnaissance + provider contract
       ├── 02 Prompt Builder
       └── 03 Generate API
              └── 04 AI Image Panel
                    └── 05 Image Preview
                          └── 06 Slide Integration
                                └── 07 Test & Demo Polish
```

`02` và phần backend của `03` có thể làm song song sau khi core types đã được chốt.

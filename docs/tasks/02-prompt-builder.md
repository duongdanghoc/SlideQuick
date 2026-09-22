# Task 02 — Prompt Builder

## Goal

Biến structured input thành optimized prompt và danh sách rule giải thích được cho Lịch sử/Vật lý.

## Read

- `ARCHITECTURE.md`
- `features/ai-image/PROMPT_RULES.md`
- `features/ai-image/ACCEPTANCE.md`
- `CODING_RULES.md`

## Work

1. Tạo taxonomy constants và validation helper dùng chung nếu phù hợp kiến trúc repo.
2. Tạo `buildPrompt(input)` thuần và deterministic.
3. Tách History Rules và Physics Rules.
4. Hỗ trợ grade adaptation, image type, style, ratio và prompt override.
5. Tạo 8 prompt templates tĩnh theo UI spec.
6. Unit test rule selection, no cross-subject leakage, override và determinism.

## Do not

- Gọi provider, database hoặc HTTP.
- Tạo bảng prompt template.
- Thêm môn thứ ba.
- Viết AI validator hoặc accuracy score.

## Done when

- Output đúng `PromptBuildResult` contract.
- Các test trong phần Determinism của `PROMPT_RULES.md` pass.
- Label `appliedRules` thân thiện và bằng tiếng Việt.
- Không có provider-specific syntax trong public interface.

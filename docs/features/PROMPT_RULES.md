# Prompt Builder and Subject Rules

## Input taxonomy

```ts
const imageTypes = {
  history: [
    'historical_event',
    'daily_life',
    'historical_character',
    'historical_architecture'
  ],
  physics: [
    'phenomenon',
    'force_diagram',
    'experiment_model',
    'real_world_application'
  ]
};

const styles = [
  'educational_illustration',
  'clean_diagram',
  'flat_illustration',
  'realistic',
  'historical_painting'
];
```

UI lọc combination vô lý; tối thiểu `clean_diagram` ưu tiên cho Vật lý và `historical_painting` cho Lịch sử.

## Build order

```text
[User intent]
[Subject context]
[Grade adaptation]
[Image type instructions]
[Style/composition]
[Subject rules]
[Shared hard constraints]
[Aspect ratio]
```

Prompt Builder trả:

```ts
{
  optimizedPrompt: string;
  appliedRules: { id: string; label: string }[];
}
```

## Shared hard constraints

- Educational illustration with a clear central subject.
- Age-appropriate and classroom-safe.
- No watermark, logo or decorative text.
- Avoid generated text, labels, equations and numerical values unless explicitly essential.
- Do not introduce people, events, objects or values absent from the request.
- Leave visual space for labels to be added in the slide editor when relevant.

## History rules

| ID | Khi áp dụng | Prompt instruction | UI label |
|---|---|---|---|
| `history.vietnam-context` | Nội dung Việt Nam | Use historically plausible Vietnamese clothing, architecture and setting for the specified period/region | Ưu tiên bối cảnh Việt Nam phù hợp |
| `history.period-consistency` | Mọi request history | Do not mix artifacts, clothing or architecture from different periods | Không trộn chi tiết khác thời kỳ |
| `history.no-invented-event` | Mọi request history | Do not invent named people, symbols or events | Không tự thêm nhân vật/sự kiện |
| `history.not-documentary` | realistic/painting | Present as an educational reconstruction, not an authentic archival record | Xác định đây là hình tái hiện |
| `history.neutral-unknowns` | Thiếu thời kỳ/địa điểm | Keep unspecified details neutral instead of fabricating specifics | Không bịa chi tiết còn thiếu |

## Physics rules

| ID | Khi áp dụng | Prompt instruction | UI label |
|---|---|---|---|
| `physics.clear-phenomenon` | Mọi request physics | Focus on one clearly visible physical phenomenon | Tập trung vào hiện tượng chính |
| `physics.vector-direction` | `force_diagram` | Show clear vector direction and point of application only when provided or physically implied | Thể hiện rõ chiều vector |
| `physics.no-invented-values` | Mọi request physics | Do not invent measurements, values or equations | Không tự thêm số liệu/công thức |
| `physics.minimize-text` | Mọi request physics | Avoid text labels; leave space for accurate slide text overlays | Hạn chế chữ do AI sinh |
| `physics.grade-level` | Mọi request physics | Match visual complexity to the selected grade level | Điều chỉnh theo cấp học |

## Grade adaptation

- `primary`: ít chi tiết, vật thể quen thuộc, một ý chính.
- `secondary`: quan hệ nguyên nhân–kết quả rõ, sơ đồ vừa phải.
- `high_school`: chính xác hơn về cấu trúc và mối quan hệ, vẫn tránh clutter.

## Prompt override

Nếu có `promptOverride`:

- dùng nội dung đó làm phần intent/style đã chỉnh;
- vẫn append safety và hard constraints;
- vẫn tính `appliedRules` từ structured options;
- không cho override vô hiệu hóa safety.

## Determinism tests

- Cùng input tạo cùng prompt/rules.
- History input không chứa Physics rule.
- Physics input không chứa History rule.
- `force_diagram` có vector rule.
- Không có số liệu trong input thì prompt yêu cầu không bịa số liệu.
- Nội dung Việt Nam kích hoạt Vietnam context rule theo logic rõ ràng hoặc flag có cấu trúc; không dựa vào mô hình trả phí trong unit test.

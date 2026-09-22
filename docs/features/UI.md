# UI Spec — AI Image Panel

## Panel structure

1. Header: `Tạo ảnh giáo dục bằng AI`.
2. Prompt cards: tối đa 4 card theo subject.
3. Textarea mô tả.
4. Subject + grade level.
5. Image type + style.
6. Aspect ratio.
7. Advanced accordion: optimized prompt preview/edit.
8. Primary button: `Tạo ảnh`.
9. Status/result region.

## Form defaults

| Field | Default |
|---|---|
| Subject | `history` hoặc giá trị cuối trong session |
| Grade | `secondary` |
| Image type | Giá trị đầu hợp lệ của subject |
| Style | `educational_illustration` |
| Ratio | `16:9` |

## Suggested labels

| Value | Nhãn UI |
|---|---|
| `history` | Lịch sử |
| `physics` | Vật lý |
| `primary` | Tiểu học |
| `secondary` | THCS |
| `high_school` | THPT |
| `1:1` | Vuông 1:1 |
| `4:3` | Slide 4:3 |
| `16:9` | Slide 16:9 |
| `3:4` | Dọc 3:4 |

## States

### Empty

- Form khả dụng.
- Khu kết quả có hướng dẫn ngắn, không dùng skeleton.

### Submitting/processing

- Disable primary button và ngăn double submit.
- Hiển thị `Đang chuẩn bị yêu cầu…` hoặc `Đang tạo ảnh…`.
- Không dùng phần trăm nếu provider không cung cấp.

### Completed

- Preview ảnh theo `object-fit: contain`.
- Actions: `Chèn vào slide` (primary), `Tải xuống`, `Tạo lại`.
- Collapsible optimized prompt.
- Applied Rules Panel.
- Educational notice.

### Failed

- Thông báo thân thiện từ error mapping.
- Actions: `Thử lại`, `Chỉnh mô tả`.
- Không xóa form hiện tại.

## Prompt cards

Mỗi card có title, one-line description, subject, image type và draft description. Không có search/filter/admin UI.

Gợi ý 8 card:

- Lịch sử: Tái hiện sự kiện; Đời sống Việt Nam xưa; Nhân vật trong bối cảnh; Kiến trúc lịch sử.
- Vật lý: Minh họa hiện tượng; Sơ đồ lực; Mô hình thí nghiệm; Ứng dụng thực tế.

## Accessibility

- Mọi field có label liên kết.
- Error dùng text, không chỉ màu.
- Status region dùng `aria-live="polite"`.
- Action có accessible name rõ.
- Focus chuyển tới error đầu tiên hoặc result heading sau submit.

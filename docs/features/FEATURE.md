# Feature Spec — AI Educational Image

## User story

Là giáo viên đang soạn slide, tôi muốn tạo một hình minh họa từ tiếng Việt có rule theo môn học để kiểm tra và chèn trực tiếp vào slide.

## Preconditions

- Người dùng đang ở Editor và có slide được chọn.
- Backend được cấu hình fake provider hoặc provider thật.
- Nếu app có auth, request dùng phiên đăng nhập hiện tại.

## Happy path

1. Mở AI Image Panel.
2. Nhập mô tả hoặc chọn prompt card.
3. Chọn các option hợp lệ.
4. Nhấn Tạo ảnh.
5. Nhận job và theo dõi trạng thái.
6. Xem kết quả, optimized prompt, applied rules và warning.
7. Chèn ảnh vào slide.
8. Di chuyển/resize, save và export.

## Behavioral rules

- `imageType` reset sang giá trị mặc định hợp lệ khi đổi subject.
- Chọn prompt card chỉ điền form; không tự gửi request.
- Basic mode không hiển thị prompt dài làm cản luồng.
- Advanced prompt được tạo từ current form; nếu form đổi, preview cũ phải được đánh dấu stale hoặc tạo lại.
- Submit bị disable khi request đang tạo hoặc form không hợp lệ.
- Tạo lại dùng input cuối cùng nhưng idempotency key mới.
- Insert nhiều lần tạo nhiều element độc lập.
- Đóng panel không làm mất ảnh đã chèn.

## Failure behaviors

| Tình huống | Hành vi |
|---|---|
| Form invalid | Hiển thị lỗi theo field, không gọi API |
| Rate limited | Thông báo thử lại sau, giữ nguyên form |
| Nội dung bị từ chối | Giải thích ngắn gọn và cho sửa mô tả |
| Provider unavailable | Hiển thị retry, không mất input |
| Poll timeout | Dừng spinner vô hạn; cho kiểm tra lại hoặc tạo request mới |
| Image load failed | Hiện placeholder + retry load/download nếu URL còn hợp lệ |
| Insert failed | Giữ preview, thông báo không thể chèn |

## Educational notice

Luôn hiển thị với completed result:

> Ảnh do AI tạo. Giáo viên cần kiểm tra độ chính xác khoa học, lịch sử và văn hóa trước khi sử dụng trong lớp học.

Không hiển thị phần trăm hoặc badge tuyên bố ảnh “đã chính xác”.

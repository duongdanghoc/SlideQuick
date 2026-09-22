# Acceptance Criteria

## AC-01 Basic generation

Given form hợp lệ, when người dùng nhấn Tạo ảnh, then một job được tạo và UI hiển thị trạng thái không đóng băng.

## AC-02 No mandatory prompt engineering

Given Basic mode, when người dùng submit, then không có bước bắt buộc xác nhận optimized prompt.

## AC-03 Subject-specific rules

Given cùng description, when subject lần lượt là history và physics, then optimized prompt/applied rules khác nhau và không lẫn rule của môn kia.

## AC-04 Advanced prompt

Given người dùng mở Advanced, when preview được tạo/chỉnh và submit, then backend sử dụng prompt override sau validation nhưng vẫn giữ hard constraints.

## AC-05 Idempotency

Given hai request cùng user và idempotency key, when gửi lặp, then server trả cùng job và không gọi provider lần hai.

## AC-06 Error safety

Given provider trả lỗi chi tiết, when API phản hồi client, then chỉ có error code/message an toàn; không lộ secret, stack hoặc raw provider payload.

## AC-07 Educational transparency

Given job completed, then UI hiển thị applied rules và cảnh báo giáo viên phải kiểm tra ảnh; không hiển thị điểm chính xác giả định.

## AC-08 Regenerate

Given một kết quả completed, when chọn Tạo lại, then một job mới với idempotency key mới được tạo từ input trước đó.

## AC-09 Insert to slide

Given ảnh completed và slide được chọn, when chọn Chèn vào slide, then image element xuất hiện giữa slide, nằm trong bounds và không méo.

## AC-10 Persistence/export

Given ảnh đã chèn, when save và mở lại project, then element còn tồn tại. When export bằng pipeline hỗ trợ ảnh hiện tại, then ảnh có trong output.

## AC-11 Poll cleanup

Given job đang processing, when panel unmount hoặc đạt terminal state, then timer/request polling được dừng.

## AC-12 CI independence

Given test suite chạy trong CI không có API key, then test dùng fake provider và vẫn pass.

## Demo scenarios

### Lịch sử

`Tái hiện một lớp học bình dân học vụ tại Việt Nam năm 1945, không khí giản dị, dùng làm minh họa bài học.`

Kỳ vọng: history/Vietnam/period rules, educational reconstruction notice, không thêm biểu tượng hoặc nhân vật nổi tiếng.

### Vật lý

`Minh họa một thùng gỗ đang được kéo trên mặt sàn ngang để học sinh nhận biết lực kéo, trọng lực, phản lực và lực ma sát.`

Kỳ vọng: force diagram/vector/no invented values/minimize text rules; bố cục dành chỗ cho label overlay.

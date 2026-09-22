Product Backlog																

	No	Chức năng	Quyền	Chi tiết (Mô tả chức năng)											Độ ưu tiên	Trạng thái
	1	Đăng ký	Người dùng	"Để tạo tài khoản mới, người dùng nhập thông tin bắt buộc trên màn hình đăng ký và nhấp vào nút ""Đăng ký"".
- Các trường bắt buộc: Tên người dùng, email, mật khẩu và vai trò (giáo viên/học sinh)
- Xác thực định dạng email: Bao gồm ký hiệu @ và đảm bảo tên miền được bao gồm sau ký hiệu @.
- Độ mạnh của mật khẩu: Xác thực rằng mật khẩu chứa ít nhất hai trong số các ký tự sau: chữ hoa/chữ thường, số và ký hiệu.
- Phải chọn một vai trò. Nếu không chọn, thông báo lỗi sẽ hiển thị.
- Đăng ký thành công: Lưu vào cơ sở dữ liệu, tiếp tục đến màn hình đăng nhập và gửi email xác nhận.
- Email trùng lặp sẽ báo lỗi."											5	Đang chờ
	2	Đăng nhập	Người dùng	"Người dùng nhập địa chỉ email/tên người dùng và mật khẩu, sau đó nhấp vào ""Đăng nhập"".
- Kiểm tra định dạng email: Email chưa đăng ký sẽ hiển thị cùng một thông báo ""Địa chỉ email hoặc mật khẩu không đúng"".
- Mật khẩu được so sánh với mật khẩu trong cơ sở dữ liệu.
- Thành công: URL trang chủ được trả về và người dùng được chuyển tiếp.
- Thất bại: Có thể áp dụng chính sách khóa (ví dụ: khóa tạm thời sau năm lần đăng nhập không thành công)."											5	Đang chờ
	3	Đăng xuất	Người dùng	"Với tư cách là người dùng đã đăng nhập, có mong muốn có thể đăng xuất khỏi hệ thống một cách an toàn. người dùng sẽ nhấp vào nút ""Đăng xuất"", thường nằm trong menu tài khoản hoặc ở vị trí dễ thấy trên giao diện. Sau đố hệ thống sẽ hiện lên cảnh cáo, người dùng phải bấm xác nhận một lần nữa để đăng xuất thành công. Sau khi đăng xuất thành công, người dùng sẽ được chuyển hướng trở lại trang đăng nhập. Mục tiêu là để bảo vệ tài khoản của người dùng khỏi bị truy cập trái phép khi không còn sử dụng thiết bị."											5	Đang chờ
	4	Quên mật khẩu	Người dùng	"Người dùng nhấp vào liên kết ""Quên mật khẩu"" trên màn hình đăng nhập.
1) Yêu cầu: Nhập địa chỉ email hoặc tên người dùng đã đăng ký của bạn.
2) Thông báo: Nếu thông tin nhập vào hợp lệ, một liên kết đặt lại mật khẩu sẽ được gửi đến email của bạn.
3) Hết hạn: Liên kết có hiệu lực trong, ví dụ: 15 phút.
4) Đặt lại: Nhập mật khẩu mới phải đáp ứng chính sách về độ mạnh. Nhập lại cùng mật khẩu để xác nhận.
5) Thành công: Sau khi lưu, tất cả các phiên hiện có sẽ bị vô hiệu hóa và người dùng được chuyển hướng đến màn hình đăng nhập. Một email thông báo hoàn tất sẽ được gửi.
6) Thất bại: Nếu mật khẩu đã hết hạn hoặc không hợp lệ, một lỗi sẽ được hiển thị và hướng dẫn cách thử lại sẽ được cung cấp."											5	Đang chờ
	5	Danh sách dự án	Người dùng	"Cung cấp cho người dùng một giao diện trung tâm để quản lý tất cả bài giảng / slide đã tạo và cả bài giảng / slide được chia sẻ 
Người dùng có thể xem, tìm kiếm, sắp xếp, mở, chỉnh sửa, chia sẻ, xóa hoặc tạo dự án mới chỉ với vài thao tác.
Mục tiêu là giúp người dùng quản lý tài nguyên giảng dạy hiệu quả, trực quan, và tiết kiệm thời gian."											1	Đang chờ
	6	Tạo/xóa dự án	Người dùng	"Cho phép tạo một bài giảng mới bằng cách: Nhập tên dự án
Sau khi tạo, hệ thống tự động lưu vào danh sách dự án. Và mở màn hình nhập nội dung và chọn template.
Xóa dự án không còn sử dụng nhằm giữ cho danh sách bài giảng gọn gàng, dễ quản lý, tránh trùng lặp:
- Xóa: chuyển thùng rác (có thời hạn) hoặc xóa vĩnh viễn
- Xác nhận quyền và hỏi lại trước khi xóa.
Mục tiêu là giúp người dùng chủ động kiểm soát kho bài giảng của mình, tối ưu hóa thao tác quản lý, đồng thời đảm bảo an toàn dữ liệu khi xóa."											2	Đang chờ
	7	Thư viện template/theme chuẩn	Người dùng	"Chức năng “Thư viện template / theme chuẩn” cho phép người dùng dễ dàng tìm kiếm, lọc, xem trước và áp dụng template cho bài giảng của mình.
Người dùng có thể chuyển đổi giữa các danh mục như “Tất cả / Giáo dục / ... / Đơn giản”, và tìm kiếm nhanh theo tên hoặc từ khóa.
Ngoài ra, người dùng có thể lọc template theo màu sắc, font chữ và bố cục, cũng như xem lại các template đã sử dụng gần đây.
Người dùng có thể lưu những mẫu yêu thích bằng cách nhấn “*”, để thuận tiện sử dụng lại sau này.
Khi chọn một template, người dùng có thể xem thông tin chi tiết và bản xem trước, đồng thời nhấn “Áp dụng” để sử dụng cho dự án hiện tại.
Ngoài ra, người dùng có thể đặt theme yêu thích làm mặc định cho các bài giảng sau này, và khi xảy ra lỗi tải, hệ thống sẽ hiển thị nút “Thử lại” cùng giao diện tải tạm (skeleton UI) để thao tác luôn mượt mà và trực quan."											2	Đang chờ
	8	Form nhập nội dung	Người dùng	"Tính năng “Biểu mẫu nhập nội dung slide” cho phép người dùng nhập nhanh các thành phần chính của slide như tiêu đề, mục tiêu học tập, đề mục, danh sách bullet và chú thích hình ảnh qua giao diện trực quan. 
Người dùng có thể kéo – thả hình ảnh vào vùng tải lên để chèn vào slide mà không cần thao tác phức tạp."											3	Đang chờ
	9	Soạn thảo	Người dùng	"Giao diện chính được chia thành ba phần: bảng slide ở bên trái cho phép thêm, xóa, sao chép slide; vùng soạn thảo ở giữa nơi người dùng kéo-thả khối và thay đổi thuộc tính (màu, font, nội dung); bảng thuộc tính và khung chat ở bên phải để điều chỉnh chi tiết slide và trao đổi. Mọi thay đổi trong vùng soạn thảo sẽ kích hoạt cơ chế lưu tự động (debounce): sau 5 giây kể từ lần thay đổi cuối cùng hệ thống sẽ gửi yêu cầu lưu. Nếu thao tác lưu gặp lỗi, một thông báo trạng thái màu đỏ ""Không thể lưu"" sẽ hiển thị cố định ở góc trên để báo cho người dùng."											1	Đang chờ
	10	Xuất file (PPTX/PDF)	Người dùng	"Người dùng nhấp vào nút ""Xuất"" và chọn định dạng đầu ra mong muốn (PPTX hoặc PDF).

Hệ thống sẽ bắt đầu xử lý và hiển thị thanh tiến trình cùng tỷ lệ phần trăm hoàn thành, đặc biệt đối với các bài giảng có hơn 50 slide.

Sau khi quá trình xuất hoàn tất, tệp sẽ tự động tải xuống trình duyệt của người dùng.

Quy định: Định dạng, bố cục và phông chữ của tệp đầu ra phải trùng khớp 100% với tệp gốc trên màn hình chỉnh sửa."											3	Đang chờ
	11	Chia sẻ & quyền (chỉnh sửa / xem)	Người dùng	"Người dùng sẽ sử dụng chức năng này để chia sẻ bài thuyết trình của mình với người khác và thiết lập quyền truy cập tương ứng.
Trước hết, người dùng sẽ chọn bài thuyết trình cần chia sẻ, sau đó nhấn nút “Chia sẻ” để mở giao diện cài đặt quyền.
Tại đây, hiện 2 đường link “Liên kết có thể xem” và ""Liên kết có thể chỉnh sửa"", người dùng chọn liên kết chia sẻ với quyền hạn cụ thể ấn vào copy đường link rồi gửi cho người được chia sẻ"											3	Đang chờ
	12	Chế độ trình chiếu (Presentation Mode)	Người dùng	"Người dùng sẽ sử dụng chức năng này để trình bày bài thuyết trình ở chế độ toàn màn hình, giúp hiển thị nội dung slide một cách rõ ràng và chuyên nghiệp.
Khi kích hoạt chế độ trình chiếu, hệ thống sẽ hiển thị từng slide ở chế độ toàn màn hình, ẩn các thanh công cụ và menu chỉnh sửa, chỉ giữ lại các nút điều khiển cơ bản như chuyển tiếp, quay lại và thoát trình chiếu.
Người dùng có thể di chuyển giữa các slide bằng phím mũi tên, chuột, hoặc điều khiển từ xa.
Khi kết thúc, người dùng chỉ cần nhấn phím ESC hoặc chọn “Thoát trình chiếu” để quay lại giao diện chỉnh sửa thông thường."											2	Đang chờ
	13	Chat theo bài	Người dùng	"Chức năng Chat được tích hợp trong Bảng thuộc tính/Chat ở phía bên phải màn hình soạn thảo. Mỗi bài giảng có một kênh chat riêng biệt. Người dùng nhập tin nhắn vào ô văn bản và nhấn Enter hoặc nút ""Gửi"". Hệ thống phải lưu lại toàn bộ lịch sử tin nhắn. Quy tắc: Khi có tin nhắn mới, một biểu tượng thông báo sẽ xuất hiện trên tab Chat cho đến khi người dùng nhấp vào để xem."											4	Đang chờ
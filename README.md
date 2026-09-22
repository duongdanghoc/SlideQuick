# EduArt AI

Ứng dụng chỉnh sửa và tạo bài thuyết trình hiện đại trên nền tảng web, giúp các nhà giáo dục và chuyên gia dễ dàng tạo, tùy chỉnh và trình bày các trang chiếu một cách chuyên nghiệp — không cần kỹ năng thiết kế.

> Dự án tốt nghiệp tại Đại học Bách Khoa Hà Nội (HUST) — Chương trình Công nghệ Thông tin Việt-Nhật (ITSS).

## Tính năng chính

- **Trình chỉnh sửa Kéo-và-Thả** — Tự do sắp xếp văn bản, hình ảnh và hình khối trên trang chiếu
- **Định dạng Văn bản Phong phú** — In đậm, in nghiêng, gạch chân với chỉnh sửa trực tiếp
- **Thư viện Mẫu thiết kế** — Các bố cục có sẵn (Tiêu đề, Hai cột, Hình ảnh + Văn bản, v.v.)
- **Xuất tệp PDF & PPTX** — Xuất chất lượng cao chính xác theo thiết kế để chia sẻ và in ấn
- **Thuyết trình Toàn màn hình** — Thuyết trình trực tiếp từ trình duyệt với các phím điều hướng
- **Cộng tác Thời gian thực** — Chỉnh sửa đa người dùng đồng thời thông qua Yjs & WebSocket
- **Lưu trữ Dữ liệu** — Quản lý dự án và trang chiếu với cơ sở dữ liệu SQLite

## Công nghệ sử dụng

| Tầng      | Công nghệ                                |
| --------- | ---------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS |
| Backend   | Express.js 5, Node.js                    |
| Database  | SQLite (better-sqlite3)                  |
| Real-time | Yjs, y-websocket, WebSocket              |
| Export    | jsPDF, html2canvas, pptxgenjs            |
| UI Icons  | Lucide React                             |

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js** ≥ 18
- **npm**

### Cài đặt

```bash
# Clone repository
git clone https://github.com/cvkhang/EduArt-AI.git
cd EduArt-AI

# Cài đặt dependencies cho Frontend
cd frontend
npm install

# Cài đặt dependencies cho Backend
cd ../server
npm install
```

### Chạy ứng dụng

```bash
# Terminal 1 — Khởi động Backend (http://localhost:3001)
cd server
npm run dev

# Terminal 2 — Khởi động Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Mở trình duyệt và truy cập [http://localhost:5173](http://localhost:5173).

## Cấu trúc Dự án

```
EduArt-AI/
├── frontend/              # Ứng dụng SPA React + TypeScript
│   └── src/
│       ├── components/    # SlideEditor, DraggableElement, TemplateLibrary
│       ├── pages/         # Home, Editor, Presentation
│       ├── context/       # Global state (AppContext)
│       ├── services/      # Lớp gọi API
│       ├── utils/         # Tiện ích xuất PDF/PPTX, xử lý bố cục
│       └── types/         # Định nghĩa kiểu TypeScript
├── server/                # Express.js REST API (MVC)
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── models/        # Database models
│       ├── routes/        # API route definitions
│       └── server.js      # Entry point
└── README.md
```

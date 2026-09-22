import { SlideElement } from "../types";

export type LayoutSpec = {
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  w: number;
  h: number;
  defaultContent: string;
  defaultStyle: any;
};

export const LAYOUT_SPECS: Record<string, Record<string, LayoutSpec>> = {
  'title': {
    title: { type: 'text', x: 80, y: 180, w: 800, h: 120, defaultContent: 'Tiêu đề bài thuyết trình', defaultStyle: { fontSize: 64, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#1e293b' } },
    subtitle: { type: 'text', x: 180, y: 310, w: 600, h: 60, defaultContent: 'Tiêu đề phụ hoặc Tên tác giả', defaultStyle: { fontSize: 28, textAlign: 'center', alignItems: 'center', color: '#64748b' } },
  },
  'title-content': {
    title: { type: 'text', x: 50, y: 40, w: 860, h: 70, defaultContent: 'Tiêu đề trang chiếu', defaultStyle: { fontSize: 48, fontWeight: 'bold', textAlign: 'left', alignItems: 'center', color: '#334155' } },
    body: { type: 'text', x: 50, y: 130, w: 860, h: 350, defaultContent: '• Nhấp để chỉnh sửa văn bản\n• Thêm nội dung vào đây', defaultStyle: { fontSize: 24, textAlign: 'left', alignItems: 'flex-start', color: '#475569', lineHeight: 1.6 } },
  },
  'two-column': {
    title: { type: 'text', x: 50, y: 40, w: 860, h: 70, defaultContent: 'Tiêu đề so sánh', defaultStyle: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#334155' } },
    body: { type: 'text', x: 50, y: 140, w: 410, h: 350, defaultContent: '• Cột 1 - Điểm chính', defaultStyle: { fontSize: 22, textAlign: 'left', alignItems: 'flex-start', color: '#475569' } },
    body2: { type: 'text', x: 500, y: 140, w: 410, h: 350, defaultContent: '• Cột 2 - Điểm chính', defaultStyle: { fontSize: 22, textAlign: 'left', alignItems: 'flex-start', color: '#475569' } },
  },
  'image-text': {
    title: { type: 'text', x: 500, y: 100, w: 410, h: 60, defaultContent: 'Khái niệm trực quan', defaultStyle: { fontSize: 42, fontWeight: 'bold', textAlign: 'left', alignItems: 'center', color: '#334155' } },
    body: { type: 'text', x: 500, y: 180, w: 410, h: 260, defaultContent: 'Mô tả hình ảnh ở đây', defaultStyle: { fontSize: 20, textAlign: 'left', alignItems: 'flex-start', color: '#64748b', lineHeight: 1.5 } },
    image: { type: 'image', x: 50, y: 100, w: 400, h: 340, defaultContent: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', defaultStyle: {} },
  },
  'quote': {
    decoration: { type: 'text', x: 80, y: 80, w: 100, h: 100, defaultContent: '"', defaultStyle: { fontSize: 140, fontWeight: 'bold', textAlign: 'left', alignItems: 'flex-start', color: '#e2e8f0' } },
    body: { type: 'text', x: 150, y: 180, w: 660, h: 180, defaultContent: '"Sự đổi mới phân biệt giữa người dẫn đầu và kẻ theo sau."', defaultStyle: { fontSize: 36, fontStyle: 'italic', textAlign: 'center', alignItems: 'center', color: '#1e293b', fontWeight: '500' } },
    author: { type: 'text', x: 580, y: 350, w: 300, h: 50, defaultContent: '— Tên tác giả', defaultStyle: { fontSize: 24, fontWeight: 'bold', textAlign: 'right', alignItems: 'center', color: '#64748b' } },
  },
  'big-number': {
    decoration: { type: 'shape', x: 360, y: 80, w: 240, h: 240, defaultContent: '', defaultStyle: { backgroundColor: '#f1f5f9', borderRadius: '50%', shapeType: 'circle' } },
    number: { type: 'text', x: 330, y: 150, w: 300, h: 100, defaultContent: '85%', defaultStyle: { fontSize: 96, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#3b82f6' } },
    title: { type: 'text', x: 230, y: 340, w: 500, h: 50, defaultContent: 'Tỷ lệ tăng trưởng', defaultStyle: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#1e293b' } },
    subtitle: { type: 'text', x: 230, y: 400, w: 500, h: 80, defaultContent: 'Tăng so với cùng kỳ năm ngoái', defaultStyle: { fontSize: 20, textAlign: 'center', alignItems: 'center', color: '#64748b' } },
  },
  'blank': {},
  'comparison': {
    title: { type: 'text', x: 50, y: 30, w: 860, h: 60, defaultContent: 'So sánh', defaultStyle: { fontSize: 42, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#1e293b' } },
    subtitle1: { type: 'text', x: 50, y: 110, w: 410, h: 50, defaultContent: 'Mục A', defaultStyle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#334155', backgroundColor: '#f1f5f9' } },
    body1: { type: 'text', x: 50, y: 170, w: 410, h: 320, defaultContent: '• Ưu điểm 1\n• Ưu điểm 2\n• Đặc điểm A', defaultStyle: { fontSize: 20, textAlign: 'left', alignItems: 'flex-start', color: '#475569', lineHeight: 1.5 } },
    subtitle2: { type: 'text', x: 500, y: 110, w: 410, h: 50, defaultContent: 'Mục B', defaultStyle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#334155', backgroundColor: '#f1f5f9' } },
    body2: { type: 'text', x: 500, y: 170, w: 410, h: 320, defaultContent: '• Nhược điểm 1\n• Nhược điểm 2\n• Đặc điểm B', defaultStyle: { fontSize: 20, textAlign: 'left', alignItems: 'flex-start', color: '#475569', lineHeight: 1.5 } },
  },
  'section-header': {
    decoration: { type: 'shape', x: 0, y: 0, w: 300, h: 540, defaultContent: '', defaultStyle: { backgroundColor: '#3b82f6', shapeType: 'rectangle', opacity: 1 } },
    title: { type: 'text', x: 350, y: 200, w: 560, h: 90, defaultContent: 'Phần 01', defaultStyle: { fontSize: 56, fontWeight: 'bold', textAlign: 'left', alignItems: 'center', color: '#1e293b' } },
    subtitle: { type: 'text', x: 350, y: 300, w: 560, h: 80, defaultContent: 'Tổng quan chủ đề chính', defaultStyle: { fontSize: 24, textAlign: 'left', alignItems: 'flex-start', color: '#64748b' } },
  },
  'content-caption': {
    image: { type: 'image', x: 50, y: 50, w: 860, h: 380, defaultContent: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&q=80', defaultStyle: {} },
    caption: { type: 'text', x: 50, y: 450, w: 860, h: 60, defaultContent: 'Hình 1: Trực quan hóa dữ liệu và kết quả phân tích', defaultStyle: { fontSize: 18, fontStyle: 'italic', textAlign: 'center', alignItems: 'center', color: '#64748b' } },
  },
  'three-column': {
    title: { type: 'text', x: 50, y: 30, w: 860, h: 60, defaultContent: '3 Điểm chính', defaultStyle: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#1e293b' } },
    col1: { type: 'text', x: 40, y: 110, w: 280, h: 380, defaultContent: '### Bước 1\n\nMô tả bước đầu tiên.', defaultStyle: { fontSize: 18, textAlign: 'left', alignItems: 'flex-start', color: '#475569' } },
    col2: { type: 'text', x: 340, y: 110, w: 280, h: 380, defaultContent: '### Bước 2\n\nChi tiết bước tiếp theo.', defaultStyle: { fontSize: 18, textAlign: 'left', alignItems: 'flex-start', color: '#475569' } },
    col3: { type: 'text', x: 640, y: 110, w: 280, h: 380, defaultContent: '### Bước 3\n\nĐiểm cuối cùng.', defaultStyle: { fontSize: 18, textAlign: 'left', alignItems: 'flex-start', color: '#475569' } },
  },
  'grid': {
    title: { type: 'text', x: 50, y: 30, w: 860, h: 60, defaultContent: 'Bố cục lưới', defaultStyle: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', color: '#1e293b' } },
    item1: { type: 'text', x: 50, y: 110, w: 410, h: 190, defaultContent: 'Mục 1', defaultStyle: { fontSize: 24, textAlign: 'center', alignItems: 'center', color: '#1e293b', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' } },
    item2: { type: 'text', x: 500, y: 110, w: 410, h: 190, defaultContent: 'Mục 2', defaultStyle: { fontSize: 24, textAlign: 'center', alignItems: 'center', color: '#1e293b', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' } },
    item3: { type: 'text', x: 50, y: 320, w: 410, h: 190, defaultContent: 'Mục 3', defaultStyle: { fontSize: 24, textAlign: 'center', alignItems: 'center', color: '#1e293b', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' } },
    item4: { type: 'text', x: 500, y: 320, w: 410, h: 190, defaultContent: 'Mục 4', defaultStyle: { fontSize: 24, textAlign: 'center', alignItems: 'center', color: '#1e293b', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' } },
  },
};

export function generateLayoutElements(template: string): SlideElement[] {
  const specs = LAYOUT_SPECS[template] || {};
  const elements: SlideElement[] = [];

  for (const [role, spec] of Object.entries(specs)) {
    elements.push({
      id: crypto.randomUUID(),
      type: spec.type,
      role: role as any,
      content: spec.defaultContent,
      x: spec.x,
      y: spec.y,
      width: spec.w,
      height: spec.h,
      style: spec.defaultStyle,
    });
  }

  return elements;
}

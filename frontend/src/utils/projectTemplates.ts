import { Slide, SlideElement } from "../types";

export interface ProjectTemplateConfig {
    id: string;
    name: string;
    thumbnailUrl?: string;
    description: string;
    tags: string[];
    colors: string[];
    fontFamily: string;
    style: {
        backgroundColor: string;
        textColor: string;
        accentColor: string;
        fontFamily: string;
    };
    slides: Array<{
        title: string;
        template: Slide['template'];
        content: string;
        customElements?: (baseElements: SlideElement[]) => SlideElement[];
    }>;
}

export const SYSTEM_TEMPLATES: ProjectTemplateConfig[] = [
    {
        id: 'modern-business',
        name: 'Doanh nghiệp hiện đại',
        description: 'Mẫu chuyên nghiệp dành cho doanh nghiệp.',
        tags: ['Business', 'Corporate', 'Blue'],
        colors: ['#f8fafc', '#1e293b', '#3b82f6'],
        fontFamily: 'Inter, sans-serif',
        style: {
            backgroundColor: '#f8fafc',
            textColor: '#1e293b',
            accentColor: '#3b82f6',
            fontFamily: 'Inter, sans-serif',
        },
        slides: [
            {
                title: 'Đề xuất kinh doanh',
                content: 'Đề xuất giải pháp đổi mới',
                template: 'title',
            },
            {
                title: 'Chương trình làm việc',
                content: 'Nội dung thảo luận hôm nay',
                template: 'three-column',
                customElements: (els) => {
                    const newEls = [...els];
                    const col1 = newEls.find(e => e.role === 'col1');
                    if (col1) col1.content = '01. Phân tích hiện trạng\n\nThách thức và cơ hội thị trường';
                    const col2 = newEls.find(e => e.role === 'col2');
                    if (col2) col2.content = '02. Đề xuất chiến lược\n\nGiải pháp cụ thể và lộ trình';
                    const col3 = newEls.find(e => e.role === 'col3');
                    if (col3) col3.content = '03. Kế hoạch tài chính\n\nDự toán ngân sách và ROI';
                    return newEls;
                }
            },
            {
                title: 'Phân tích thị trường',
                content: 'Lợi thế cạnh tranh',
                template: 'comparison',
            },
            {
                title: 'Kế hoạch dự án',
                content: 'Thời gian biểu và các mốc quan trọng',
                template: 'section-header',
            },
            {
                title: 'Thống kê chính',
                content: 'Tốc độ tăng trưởng và thị phần',
                template: 'big-number',
            },
            {
                title: 'Tóm tắt',
                content: 'Cảm ơn quý vị đã lắng nghe',
                template: 'title-content',
            }
        ]
    },
    {
        id: 'creative-dark',
        name: 'Sáng tạo Tối màu',
        description: 'Thiết kế chế độ tối tinh tế.',
        tags: ['Creative', 'Dark', 'Portfolio'],
        colors: ['#111827', '#f3f4f6', '#8b5cf6'],
        fontFamily: 'Roboto, sans-serif',
        style: {
            backgroundColor: '#111827',
            textColor: '#f3f4f6',
            accentColor: '#8b5cf6',
            fontFamily: 'Roboto, sans-serif',
        },
        slides: [
            {
                title: 'HỒ SƠ NĂNG LỰC 2024',
                content: 'Tác phẩm & Thành tựu',
                template: 'title',
            },
            {
                title: 'Tầm nhìn',
                content: '"Thiết kế phải phục vụ mục đích ứng dụng"',
                template: 'quote',
            },
            {
                title: 'Về tôi',
                content: 'Kinh nghiệm thiết kế',
                template: 'two-column',
            },
            {
                title: 'Tác phẩm tiêu biểu',
                content: 'Các dự án gần đây',
                template: 'grid',
            },
            {
                title: 'Quy trình',
                content: 'Quy trình sản xuất',
                template: 'three-column',
            },
            {
                title: 'Liên hệ',
                content: 'Liên hệ với chúng tôi tại đây',
                template: 'title-content',
            }
        ]
    },
    {
        id: 'academic-clean',
        name: 'Học thuật Tối giản',
        description: 'Bố cục tối ưu cho thuyết trình báo cáo và bài giảng.',
        tags: ['Academic', 'Education', 'Simple'],
        colors: ['#ffffff', '#333333', '#059669'],
        fontFamily: 'Merriweather, serif',
        style: {
            backgroundColor: '#ffffff',
            textColor: '#333333',
            accentColor: '#059669',
            fontFamily: 'Merriweather, serif',
        },
        slides: [
            {
                title: 'Báo cáo nghiên cứu',
                content: 'Tên đề tài: Vai trò của AI trong các mục tiêu phát triển bền vững',
                template: 'title',
            },
            {
                title: 'Tổng quan nghiên cứu',
                content: 'Mục tiêu và phương pháp nghiên cứu',
                template: 'title-content',
            },
            {
                title: 'Nghiên cứu trước đây',
                content: 'Tổng quan tài liệu tham khảo',
                template: 'two-column',
            },
            {
                title: 'Kết quả thử nghiệm',
                content: 'Kết quả phân tích dữ liệu',
                template: 'content-caption',
            },
            {
                title: 'Thảo luận',
                content: 'Giải thích kết quả và ý nghĩa',
                template: 'three-column',
            },
            {
                title: 'Kết luận',
                content: 'Hướng phát triển tương lai',
                template: 'section-header',
            }
        ]
    },
    {
        id: 'startup-pitch',
        name: 'Gọi vốn Startup',
        description: 'Bài thuyết trình ấn tượng dành cho nhà đầu tư.',
        tags: ['Startup', 'Pitch', 'Bold'],
        colors: ['#fff1f2', '#881337', '#e11d48'],
        fontFamily: 'Montserrat, sans-serif',
        style: {
            backgroundColor: '#fff1f2',
            textColor: '#881337',
            accentColor: '#e11d48',
            fontFamily: 'Montserrat, sans-serif',
        },
        slides: [
            {
                title: 'VENTURE',
                content: 'Future of Technology',
                template: 'title',
            },
            {
                title: 'Vấn đề',
                content: 'Vấn đề chúng tôi đang giải quyết',
                template: 'title-content',
            },
            {
                title: 'Giải pháp',
                content: 'Cách chúng tôi giải quyết',
                template: 'image-text',
            },
            {
                title: 'Quy mô thị trường',
                content: 'TAM, SAM, SOM',
                template: 'big-number',
            },
            {
                title: 'Mô hình kinh doanh',
                content: 'Cách chúng tôi tạo ra doanh thu',
                template: 'grid',
            },
            {
                title: 'Đội ngũ',
                content: 'Chúng tôi là ai',
                template: 'three-column',
            }
        ]
    },
    {
        id: 'nature-calm',
        name: 'Tự nhiên Êm dịu',
        description: 'Tông màu tự nhiên thư thái.',
        tags: ['Nature', 'Calm', 'Green'],
        colors: ['#f0fdf4', '#14532d', '#15803d'],
        fontFamily: 'Open Sans, sans-serif',
        style: {
            backgroundColor: '#f0fdf4',
            textColor: '#14532d',
            accentColor: '#15803d',
            fontFamily: 'Open Sans, sans-serif',
        },
        slides: [
            {
                title: 'Cuộc sống Hữu cơ',
                content: 'Hướng dẫn lối sống bền vững',
                template: 'title',
            },
            {
                title: 'Khái niệm',
                content: 'Hòa hợp với thiên nhiên',
                template: 'image-text',
            },
            {
                title: 'Triết lý',
                content: 'Giá trị cốt lõi của chúng tôi',
                template: 'quote',
            },
            {
                title: 'Lợi ích',
                content: 'Các ưu điểm chính',
                template: 'grid',
            },
            {
                title: 'Sản phẩm',
                content: 'Danh mục sản phẩm',
                template: 'three-column',
            },
            {
                title: 'Cảm ơn',
                content: 'Tham gia cộng đồng của chúng tôi',
                template: 'title-content',
            }
        ]
    }
];

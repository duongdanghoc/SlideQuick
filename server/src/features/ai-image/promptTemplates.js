'use strict';

const PROMPT_TEMPLATES = Object.freeze([
  Object.freeze({ id: 'history-event', title: 'Tái hiện sự kiện', description: 'Minh họa một sự kiện lịch sử để dùng trong bài học.', subject: 'history', imageType: 'historical_event', draftDescription: 'Tái hiện một sự kiện lịch sử với bối cảnh, nhân vật và không khí phù hợp thời kỳ.' }),
  Object.freeze({ id: 'history-daily-life', title: 'Đời sống Việt Nam xưa', description: 'Khắc họa sinh hoạt đời thường trong lịch sử Việt Nam.', subject: 'history', imageType: 'daily_life', draftDescription: 'Minh họa đời sống thường ngày của người Việt Nam trong một thời kỳ lịch sử cụ thể.' }),
  Object.freeze({ id: 'history-character', title: 'Nhân vật trong bối cảnh', description: 'Đặt nhân vật lịch sử vào bối cảnh phù hợp.', subject: 'history', imageType: 'historical_character', draftDescription: 'Minh họa một nhân vật lịch sử trong bối cảnh thời đại và địa điểm phù hợp.' }),
  Object.freeze({ id: 'history-architecture', title: 'Kiến trúc lịch sử', description: 'Làm nổi bật một công trình hoặc phong cách kiến trúc.', subject: 'history', imageType: 'historical_architecture', draftDescription: 'Minh họa một công trình kiến trúc lịch sử với các đặc trưng quan trọng cho bài học.' }),
  Object.freeze({ id: 'physics-phenomenon', title: 'Minh họa hiện tượng', description: 'Làm rõ một hiện tượng vật lý chính.', subject: 'physics', imageType: 'phenomenon', draftDescription: 'Minh họa một hiện tượng vật lý với nguyên nhân và kết quả dễ quan sát.' }),
  Object.freeze({ id: 'physics-force-diagram', title: 'Sơ đồ lực', description: 'Trình bày các lực tác dụng lên một vật.', subject: 'physics', imageType: 'force_diagram', draftDescription: 'Minh họa một vật và các lực tác dụng, chừa chỗ để thêm nhãn chính xác trên slide.' }),
  Object.freeze({ id: 'physics-experiment', title: 'Mô hình thí nghiệm', description: 'Thể hiện rõ bố trí và thành phần thí nghiệm.', subject: 'physics', imageType: 'experiment_model', draftDescription: 'Minh họa mô hình một thí nghiệm vật lý với dụng cụ và bố trí rõ ràng.' }),
  Object.freeze({ id: 'physics-application', title: 'Ứng dụng thực tế', description: 'Liên hệ nguyên lý vật lý với đời sống.', subject: 'physics', imageType: 'real_world_application', draftDescription: 'Minh họa một ứng dụng thực tế của nguyên lý vật lý trong đời sống.' }),
]);

module.exports = { PROMPT_TEMPLATES };

export const IMAGE_TYPES = {
  history: [
    "historical_event",
    "daily_life",
    "historical_character",
    "historical_architecture",
  ],
  physics: [
    "phenomenon",
    "force_diagram",
    "experiment_model",
    "real_world_application",
  ],
} as const;
export type Subject = keyof typeof IMAGE_TYPES;
export type ImageType = (typeof IMAGE_TYPES)[Subject][number];
export const GRADE_LEVELS = ["primary", "secondary", "high_school"] as const;
export const STYLES = [
  "educational_illustration",
  "clean_diagram",
  "flat_illustration",
  "realistic",
  "historical_painting",
] as const;
export const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "3:4"] as const;
export const LABELS = {
  subjects: { history: "Lịch sử", physics: "Vật lý" },
  grades: { primary: "Tiểu học", secondary: "THCS", high_school: "THPT" },
  imageTypes: {
    historical_event: "Tái hiện sự kiện",
    daily_life: "Đời sống xưa",
    historical_character: "Nhân vật lịch sử",
    historical_architecture: "Kiến trúc lịch sử",
    phenomenon: "Hiện tượng vật lý",
    force_diagram: "Sơ đồ lực",
    experiment_model: "Mô hình thí nghiệm",
    real_world_application: "Ứng dụng thực tế",
  },
  styles: {
    educational_illustration: "Minh họa giáo dục",
    clean_diagram: "Sơ đồ rõ ràng",
    flat_illustration: "Minh họa phẳng",
    realistic: "Chân thực",
    historical_painting: "Tranh lịch sử",
  },
  ratios: {
    "1:1": "Vuông 1:1",
    "4:3": "Slide 4:3",
    "16:9": "Slide 16:9",
    "3:4": "Dọc 3:4",
  },
} as const;
export interface PromptCard {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  imageType: ImageType;
  draftDescription: string;
}
export const PROMPT_CARDS: PromptCard[] = [
  [
    "history-event",
    "Tái hiện sự kiện",
    "Minh họa một sự kiện lịch sử.",
    "history",
    "historical_event",
    "Tái hiện một sự kiện lịch sử với bối cảnh, nhân vật và không khí phù hợp thời kỳ.",
  ],
  [
    "history-life",
    "Đời sống Việt Nam xưa",
    "Khắc họa sinh hoạt đời thường.",
    "history",
    "daily_life",
    "Minh họa đời sống thường ngày của người Việt Nam trong một thời kỳ lịch sử cụ thể.",
  ],
  [
    "history-character",
    "Nhân vật trong bối cảnh",
    "Đặt nhân vật vào đúng thời đại.",
    "history",
    "historical_character",
    "Minh họa một nhân vật lịch sử trong bối cảnh thời đại và địa điểm phù hợp.",
  ],
  [
    "history-building",
    "Kiến trúc lịch sử",
    "Làm nổi bật một công trình.",
    "history",
    "historical_architecture",
    "Minh họa một công trình kiến trúc lịch sử với các đặc trưng quan trọng cho bài học.",
  ],
  [
    "physics-phenomenon",
    "Minh họa hiện tượng",
    "Làm rõ hiện tượng vật lý.",
    "physics",
    "phenomenon",
    "Minh họa một hiện tượng vật lý với nguyên nhân và kết quả dễ quan sát.",
  ],
  [
    "physics-force",
    "Sơ đồ lực",
    "Trình bày lực tác dụng lên vật.",
    "physics",
    "force_diagram",
    "Minh họa một vật và các lực tác dụng, chừa chỗ để thêm nhãn chính xác trên slide.",
  ],
  [
    "physics-experiment",
    "Mô hình thí nghiệm",
    "Thể hiện rõ bố trí thí nghiệm.",
    "physics",
    "experiment_model",
    "Minh họa mô hình một thí nghiệm vật lý với dụng cụ và bố trí rõ ràng.",
  ],
  [
    "physics-application",
    "Ứng dụng thực tế",
    "Liên hệ nguyên lý với đời sống.",
    "physics",
    "real_world_application",
    "Minh họa một ứng dụng thực tế của nguyên lý vật lý trong đời sống.",
  ],
].map(
  ([id, title, description, subject, imageType, draftDescription]) =>
    ({
      id,
      title,
      description,
      subject,
      imageType,
      draftDescription,
    }) as PromptCard,
);

import PptxGenJS from "pptxgenjs";
import { Project } from "../types";

/**
 * Export project to PPTX
 */
export const exportToPPTX = async (project: Project) => {
  const pptx = new PptxGenJS();

  // Set Presentation Properties
  pptx.layout = "LAYOUT_16x9";
  pptx.title = project.name;
  pptx.author = project.ownerName || "Người dùng EduArt AI";

  // Process each slide
  for (const slide of project.slides) {
    const pptxSlide = pptx.addSlide();

    // 1. Background Color
    if (slide.backgroundColor) {
      if (slide.backgroundColor.startsWith("#")) {
        pptxSlide.background = { color: slide.backgroundColor.substring(1) };
      } else {
        // Handle other formats if needed, or default
        pptxSlide.background = { color: "FFFFFF" };
      }
    }

    // 2. Add Elements
    if (slide.elements) {
      for (const element of slide.elements) {
        // Calculate position and size (SlideQuick uses 960x540 base)
        // pptxgenjs uses inches by default. 960px / 96dpi = 10 inches.
        const x = element.x / 96;
        const y = element.y / 96;
        const w = element.width / 96;
        const h = element.height / 96;

        // Handle Text
        if (element.type === "text") {
          const fontSize = element.style?.fontSize || 16;
          // Convert px font size to points (approx 0.75 ratio usually, but direct mapping might be close enough for web->ppt)

          pptxSlide.addText(element.content, {
            x: x,
            y: y,
            w: w,
            h: h,
            fontSize: fontSize,
            color: element.style?.color?.replace("#", "") || "000000",
            fill: element.style?.backgroundColor ? { color: element.style.backgroundColor.replace("#", "") } : undefined,
            align: element.style?.textAlign as any || "left",
            // valign: "top", // Default
            fontFace: "Arial", // Default fallback
            isTextBox: true,
          });
        }

        // Handle Image
        else if (element.type === "image") {
          // Check if it's a valid URL or Base64
          if (element.content) {
            const source = await resolveImageSource(element.content);
            pptxSlide.addImage({
              ...source,
              x: x,
              y: y,
              w: w,
              h: h,
            });
          }
        }

        // Handle Shape
        else if (element.type === "shape") {
          let shapeType = pptx.ShapeType.rect;
          if (element.style?.shapeType === "circle") shapeType = pptx.ShapeType.ellipse;
          if (element.style?.shapeType === "triangle") shapeType = pptx.ShapeType.triangle;

          pptxSlide.addShape(shapeType, {
            x: x,
            y: y,
            w: w,
            h: h,
            fill: { color: element.style?.backgroundColor?.replace("#", "") || "3B82F6" },
          });
        }
      }
    }
  }

  // Save the file
  await pptx.writeFile({ fileName: `${project.name}.pptx` });
};

async function resolveImageSource(source: string): Promise<{ path?: string; data?: string }> {
  if (source.startsWith('data:')) return { data: source };
  if (/^https?:\/\//i.test(source) || source.startsWith('/')) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Không thể tải ảnh để xuất PPTX (${response.status})`);
    const blob = await response.blob();
    const data = await blobToDataUrl(blob);
    return { data };
  }
  return { path: source };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error('Không thể đọc dữ liệu ảnh'));
    reader.readAsDataURL(blob);
  });
}

import type { SlideElement } from '../types';

export interface GeneratedImageInput {
  id: string;
  url: string;
  width?: number | null;
  height?: number | null;
}

export interface ImageFit {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_IMAGE_WIDTH = 1600;
const DEFAULT_IMAGE_HEIGHT = 900;

/** Calculates a centered, uncropped image rectangle that stays inside the slide. */
export function calculateContainFit(
  imageWidth?: number | null,
  imageHeight?: number | null,
  slideWidth = 960,
  slideHeight = 540,
  margin = 40,
): ImageFit {
  const safeSlideWidth = Math.max(1, slideWidth);
  const safeSlideHeight = Math.max(1, slideHeight);
  const safeMargin = Math.max(0, Math.min(margin, (safeSlideWidth - 1) / 2, (safeSlideHeight - 1) / 2));
  const availableWidth = safeSlideWidth - safeMargin * 2;
  const availableHeight = safeSlideHeight - safeMargin * 2;
  const hasDimensions =
    typeof imageWidth === 'number' && Number.isFinite(imageWidth) && imageWidth > 0 &&
    typeof imageHeight === 'number' && Number.isFinite(imageHeight) && imageHeight > 0;
  const sourceWidth = hasDimensions ? imageWidth : DEFAULT_IMAGE_WIDTH;
  const sourceHeight = hasDimensions ? imageHeight : DEFAULT_IMAGE_HEIGHT;
  const scale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  return {
    x: Math.round((safeSlideWidth - width) / 2),
    y: Math.round((safeSlideHeight - height) / 2),
    width,
    height,
  };
}

export function generatedImageToSlideElement(
  image: GeneratedImageInput,
  slideWidth = 960,
  slideHeight = 540,
  margin = 40,
): SlideElement {
  const fit = calculateContainFit(image.width, image.height, slideWidth, slideHeight, margin);
  return {
    id: crypto.randomUUID(),
    type: 'image',
    content: image.url,
    ...fit,
    style: { imageFit: 'contain' },
    role: 'image',
  };
}

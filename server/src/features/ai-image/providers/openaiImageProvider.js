"use strict";

const crypto = require("crypto");
const OpenAI = require("openai");
const ImageProvider = require("./imageProvider");
const { ASPECT_RATIOS, JOB_STATUS } = require("../types");

const DIMENSIONS = {
  "1:1": { size: "1024x1024", width: 1024, height: 1024 },
  "4:3": { size: "1536x1024", width: 1536, height: 1024 },
  "16:9": { size: "1536x1024", width: 1536, height: 1024 },
  "3:4": { size: "1024x1536", width: 1024, height: 1536 },
};

class OpenAIImageProvider extends ImageProvider {
  constructor(options = {}) {
    super();

    if (!options.apiKey) {
      throw new Error("OPENAI_API_KEY is required when IMAGE_PROVIDER=openai");
    }

    this.client = new OpenAI({ apiKey: options.apiKey });
    this.model = options.model || "gpt-image-2.5-flare";
    this.quality = options.quality || "medium";
  }

  async generate({ prompt, aspectRatio }) {
    if (!ASPECT_RATIOS.includes(aspectRatio)) {
      throw new TypeError(`Unsupported aspect ratio: ${aspectRatio}`);
    }

    const dimensions = DIMENSIONS[aspectRatio];

    const result = await this.client.images.generate({
      model: this.model,
      prompt,
      size: dimensions.size,
      quality: this.quality,
      output_format: "png",
    });

    const base64 = result.data?.[0]?.b64_json;

    if (!base64) {
      throw new Error("OpenAI did not return image data");
    }

    return {
      externalJobId: `openai_${crypto.randomUUID()}`,
      status: JOB_STATUS.COMPLETED,
      image: {
        id: `openai_img_${crypto.randomUUID()}`,
        url: `data:image/png;base64,${base64}`,
        width: dimensions.width,
        height: dimensions.height,
        mimeType: "image/png",
        provider: "openai",
        model: this.model,
      },
    };
  }

  async getStatus() {
    throw new Error("OpenAI image generation is synchronous");
  }
}

module.exports = OpenAIImageProvider;

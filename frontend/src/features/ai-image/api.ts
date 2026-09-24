import type { Subject, ImageType } from "./config";
export type JobStatus = "queued" | "processing" | "completed" | "failed";
export interface CreateImageInput {
  description: string;
  subject: Subject;
  gradeLevel: "primary" | "secondary" | "high_school";
  imageType: ImageType;
  style:
    | "educational_illustration"
    | "clean_diagram"
    | "flat_illustration"
    | "realistic"
    | "historical_painting";
  aspectRatio: "1:1" | "4:3" | "16:9" | "3:4";
  promptOverride: string | null;
  projectId?: string;
  slideId?: string;
}
export interface ImageJob {
  jobId: string;
  status: JobStatus;
  optimizedPrompt?: string;
  appliedRules?: { id: string; label: string }[];
  image?: {
    id: string;
    url: string;
    width: number;
    height: number;
    mimeType: string;
    provider: string;
    model: string;
  } | null;
  error?: { code: string; message: string } | null;
}
export type GeneratedImage = NonNullable<ImageJob["image"]>;
export class AiImageApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export function resolveImageUrl(url: string): string {
  const base = new URL(API_URL, window.location.origin);
  const resolved = new URL(url, `${base.origin}/`);
  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
    throw new Error("Địa chỉ ảnh không hợp lệ.");
  }
  return resolved.href;
}
async function request<T>(
  path: string,
  init: RequestInit,
  signal?: AbortSignal,
): Promise<T> {
  const token = localStorage.getItem("sq_token");
  const response = await fetch(`${API_URL}/ai-images${path}`, {
    ...init,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new AiImageApiError(
      payload.error?.code || "INTERNAL_ERROR",
      payload.error?.message || "Không thể tạo ảnh lúc này.",
      payload.error?.fields,
    );
  return payload.data as T;
}
export const createImageJob = (
  input: CreateImageInput,
  key: string,
  signal?: AbortSignal,
) =>
  request<ImageJob>(
    "/jobs",
    {
      method: "POST",
      headers: { "Idempotency-Key": key },
      body: JSON.stringify(input),
    },
    signal,
  );
export const getImageJob = (jobId: string, signal?: AbortSignal) =>
  request<ImageJob>(
    `/jobs/${encodeURIComponent(jobId)}`,
    { method: "GET" },
    signal,
  );

import { useEffect, useState } from "react";
import { Download, ImageOff, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import {
  resolveImageUrl,
  type GeneratedImage,
  type ImageJob,
} from "./api";

interface Props {
  job: ImageJob;
  isBusy: boolean;
  onRegenerate: () => Promise<boolean>;
  onInsert?: (image: GeneratedImage) => void | Promise<void>;
}

const extensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export function AiImageResult({ job, isBusy, onRegenerate, onInsert }: Props) {
  const image = job.image;
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "error">("idle");
  const [insertError, setInsertError] = useState<string | null>(null);

  useEffect(() => {
    setImageState("loading");
    setReloadKey(0);
    setDownloadState("idle");
    setInsertError(null);
  }, [image?.id]);

  if (!image) return <p className="mt-2 text-red-700">Kết quả không chứa ảnh có thể sử dụng.</p>;

  let imageUrl: string;
  try {
    imageUrl = resolveImageUrl(image.url);
  } catch {
    imageUrl = "";
  }

  const retryImage = () => {
    setImageState("loading");
    setReloadKey((value) => value + 1);
  };

  const download = async () => {
    if (!imageUrl || downloadState === "loading") return;
    setDownloadState("loading");
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("download failed");
      const blob = await response.blob();
      const mimeType = blob.type || image.mimeType;
      if (!mimeType.startsWith("image/")) throw new Error("invalid image response");
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      const safeId = image.id.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "image";
      anchor.download = `eduart-${safeId}.${extensionByMime[mimeType] || "png"}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
      setDownloadState("idle");
    } catch {
      setDownloadState("error");
    }
  };

  const insert = async () => {
    if (!onInsert) return;
    setInsertError(null);
    try {
      await onInsert(image);
    } catch {
      setInsertError("Không thể chèn ảnh vào slide. Bản xem trước vẫn được giữ lại.");
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-slate-100">
        {imageUrl && imageState === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Đang tải ảnh…
          </div>
        ) : null}
        {imageUrl ? (
          <img
            key={reloadKey}
            src={imageUrl}
            alt="Ảnh giáo dục do AI tạo"
            className={`h-full w-full object-contain ${imageState === "error" ? "hidden" : ""}`}
            onLoad={() => setImageState("loaded")}
            onError={() => setImageState("error")}
          />
        ) : null}
        {imageState === "error" || !imageUrl ? (
          <div className="p-4 text-center text-slate-600">
            <ImageOff className="mx-auto mb-2 h-7 w-7" />
            <p>Không thể tải bản xem trước.</p>
            {imageUrl ? <button type="button" onClick={retryImage} className="mt-1 font-semibold text-primary-600">Tải lại ảnh</button> : null}
          </div>
        ) : null}
      </div>

      <div className={`grid gap-2 ${onInsert ? "grid-cols-3" : "grid-cols-2"}`}>
        {onInsert ? (
          <button type="button" onClick={insert} className="flex items-center justify-center gap-1 rounded-lg bg-primary-600 px-2 py-2 text-xs font-semibold text-white">
            <Plus className="h-4 w-4" /> Chèn vào slide
          </button>
        ) : null}
        <button type="button" onClick={download} disabled={!imageUrl || downloadState === "loading"} className="flex items-center justify-center gap-1 rounded-lg border bg-white px-2 py-2 text-xs font-semibold disabled:opacity-50">
          <Download className="h-4 w-4" /> {downloadState === "loading" ? "Đang tải…" : "Tải xuống"}
        </button>
        <button type="button" onClick={() => void onRegenerate()} disabled={isBusy} className="flex items-center justify-center gap-1 rounded-lg border bg-white px-2 py-2 text-xs font-semibold disabled:opacity-50">
          <RefreshCw className="h-4 w-4" /> Tạo lại
        </button>
      </div>
      <div aria-live="polite">
        {downloadState === "error" ? <p className="text-xs text-red-700">Không thể tải xuống ảnh. Vui lòng thử lại.</p> : null}
        {insertError ? <p className="text-xs text-red-700">{insertError}</p> : null}
      </div>

      <details className="rounded-lg border bg-white p-3">
        <summary className="cursor-pointer font-semibold">Prompt đã tối ưu</summary>
        <p className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-600">{job.optimizedPrompt || "Không có prompt tối ưu được trả về."}</p>
      </details>

      <div className="rounded-lg border bg-white p-3">
        <h4 className="font-semibold">Quy tắc đã áp dụng</h4>
        {job.appliedRules?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {job.appliedRules.map((rule) => <li key={rule.id}>{rule.label}</li>)}
          </ul>
        ) : <p className="mt-1 text-xs text-slate-500">Không có quy tắc bổ sung.</p>}
      </div>

      <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Ảnh do AI tạo. Giáo viên cần kiểm tra độ chính xác khoa học, lịch sử và văn hóa trước khi sử dụng trong lớp học.
      </p>
    </div>
  );
}

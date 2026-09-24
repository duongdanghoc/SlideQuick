import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import {
  ASPECT_RATIOS,
  GRADE_LEVELS,
  IMAGE_TYPES,
  LABELS,
  PROMPT_CARDS,
  STYLES,
  type ImageType,
  type Subject,
} from "./config";
import type { CreateImageInput } from "./api";
import { useAiImageJob } from "./useAiImageJob";
import { AiImageResult } from "./AiImageResult";
import type { GeneratedImage } from "./api";
interface Props {
  projectId?: string;
  slideId?: string;
  onClose?: () => void;
  onInsert?: (image: GeneratedImage) => void | Promise<void>;
  variant?: "panel" | "page";
}
const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";
export function AiImagePanel({
  projectId,
  slideId,
  onClose,
  onInsert,
  variant = "panel",
}: Props) {
  const [subject, setSubject] = useState<Subject>(() =>
    sessionStorage.getItem("ai-image-subject") === "physics"
      ? "physics"
      : "history",
  );
  const [imageType, setImageType] = useState<ImageType>(
    IMAGE_TYPES[subject][0],
  );
  const [description, setDescription] = useState("");
  const [gradeLevel, setGrade] =
    useState<CreateImageInput["gradeLevel"]>("secondary");
  const [style, setStyle] = useState<CreateImageInput["style"]>(
    "educational_illustration",
  );
  const [aspectRatio, setRatio] =
    useState<CreateImageInput["aspectRatio"]>("16:9");
  const [advanced, setAdvanced] = useState(false);
  const [promptOverride, setPrompt] = useState("");
  const [previewSignature, setPreviewSignature] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const { state, job, error, submit, regenerate, isBusy } = useAiImageJob();
  const signature = `${description}|${subject}|${gradeLevel}|${imageType}|${style}|${aspectRatio}`;
  const preview = useMemo(
    () =>
      `Mô tả: ${description.trim() || "(chưa có mô tả)"}\nMôn: ${LABELS.subjects[subject]}; cấp học: ${LABELS.grades[gradeLevel]}; loại ảnh: ${LABELS.imageTypes[imageType]}; phong cách: ${LABELS.styles[style]}; tỷ lệ: ${aspectRatio}.\nẢnh giáo dục an toàn, bố cục rõ ràng, không logo hoặc watermark, hạn chế chữ do AI sinh.`,
    [description, subject, gradeLevel, imageType, style, aspectRatio],
  );
  const changeSubject = (next: Subject) => {
    setSubject(next);
    setImageType(IMAGE_TYPES[next][0]);
    sessionStorage.setItem("ai-image-subject", next);
  };
  const choose = (card: (typeof PROMPT_CARDS)[number]) => {
    changeSubject(card.subject);
    setImageType(card.imageType);
    setDescription(card.draftDescription);
    descriptionRef.current?.focus();
  };
  const validate = () => {
    const next: Record<string, string> = {};
    if (description.trim().length < 10 || description.trim().length > 1000)
      next.description = "Mô tả phải có từ 10 đến 1000 ký tự.";
    if (promptOverride.length > 3000)
      next.promptOverride = "Prompt nâng cao không được vượt quá 3000 ký tự.";
    setErrors(next);
    if (next.description) descriptionRef.current?.focus();
    return !Object.keys(next).length;
  };
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy || !validate()) return;
    await submit({
      description: description.trim(),
      subject,
      gradeLevel,
      imageType,
      style,
      aspectRatio,
      promptOverride:
        advanced && promptOverride.trim() ? promptOverride.trim() : null,
      projectId,
      slideId,
    });
  };
  useEffect(() => {
    if (state === "completed" || state === "failed" || state === "timed_out") {
      resultHeadingRef.current?.focus();
    }
  }, [state]);
  return (
    <aside
      className={
        variant === "page"
          ? "flex min-h-[calc(100vh-11rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          : "fixed inset-y-0 right-0 z-40 flex w-full max-w-[380px] flex-col border-l border-slate-200 bg-white shadow-xl lg:static lg:z-20 lg:w-[380px] lg:shrink-0"
      }
      aria-label="Tạo ảnh giáo dục bằng AI"
    >
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h2 className="font-bold">Tạo ảnh giáo dục bằng AI</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng tạo ảnh"
            className="rounded p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <form onSubmit={send} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Gợi ý nhanh
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PROMPT_CARDS.filter((c) => c.subject === subject)
              .slice(0, 4)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => choose(c)}
                  className="rounded-lg border p-2 text-left hover:border-primary-400 hover:bg-primary-50"
                >
                  <b className="block text-sm">{c.title}</b>
                  <span className="block text-xs text-slate-500">
                    {c.description}
                  </span>
                </button>
              ))}
          </div>
        </div>
        <label className="block text-sm font-medium">
          Mô tả ảnh
          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={1000}
            className={`${field} mt-1 resize-y`}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description ? (
            <span id="description-error" className="text-xs text-red-600">
              {errors.description}
            </span>
          ) : null}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            Môn học
            <select
              value={subject}
              onChange={(e) => changeSubject(e.target.value as Subject)}
              className={`${field} mt-1`}
            >
              {Object.entries(LABELS.subjects).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Cấp học
            <select
              value={gradeLevel}
              onChange={(e) => setGrade(e.target.value as typeof gradeLevel)}
              className={`${field} mt-1`}
            >
              {GRADE_LEVELS.map((v) => (
                <option key={v} value={v}>
                  {LABELS.grades[v]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Loại ảnh
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value as ImageType)}
            className={`${field} mt-1`}
          >
            {IMAGE_TYPES[subject].map((v) => (
              <option key={v} value={v}>
                {LABELS.imageTypes[v]}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            Phong cách
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as typeof style)}
              className={`${field} mt-1`}
            >
              {STYLES.map((v) => (
                <option key={v} value={v}>
                  {LABELS.styles[v]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Tỷ lệ
            <select
              value={aspectRatio}
              onChange={(e) => setRatio(e.target.value as typeof aspectRatio)}
              className={`${field} mt-1`}
            >
              {ASPECT_RATIOS.map((v) => (
                <option key={v} value={v}>
                  {LABELS.ratios[v]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <details
          open={advanced}
          onToggle={(e) => setAdvanced(e.currentTarget.open)}
          className="rounded-lg border p-3"
        >
          <summary className="cursor-pointer text-sm font-semibold">
            Nâng cao: xem/chỉnh prompt
          </summary>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setPrompt(preview);
                setPreviewSignature(signature);
              }}
              className="mb-2 text-xs font-semibold text-primary-600 hover:underline"
            >
              {promptOverride ? "Tạo lại preview" : "Tạo preview"}
            </button>
            {previewSignature && previewSignature !== signature ? (
              <span className="ml-2 text-xs text-amber-700">
                Preview đã cũ.
              </span>
            ) : null}
            <textarea
              value={promptOverride}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              maxLength={3000}
              className={`${field} resize-y`}
              placeholder="Tạo preview từ form, sau đó có thể chỉnh sửa."
            />
            {errors.promptOverride ? (
              <span className="text-xs text-red-600">
                {errors.promptOverride}
              </span>
            ) : null}
          </div>
        </details>
        <button
          type="submit"
          disabled={isBusy || description.trim().length < 10}
          className="w-full rounded-lg bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {state === "submitting"
            ? "Đang chuẩn bị yêu cầu…"
            : state === "processing"
              ? "Đang tạo ảnh…"
              : "Tạo ảnh"}
        </button>
        <section
          aria-live="polite"
          aria-atomic="true"
          className="rounded-lg bg-slate-50 p-3 text-sm"
        >
          <h3 ref={resultHeadingRef} tabIndex={-1} className="font-semibold outline-none">
            Trạng thái
          </h3>
          {state === "idle" ? (
            <p className="mt-1 text-slate-500">
              Điền mô tả hoặc chọn một gợi ý để bắt đầu.
            </p>
          ) : null}
          {state === "submitting" ? <p>Đang chuẩn bị yêu cầu…</p> : null}
          {state === "processing" ? (
            <p>Đang tạo ảnh… Bạn có thể tiếp tục chỉnh sửa slide.</p>
          ) : null}
          {state === "failed" || state === "timed_out" ? (
            <div>
              <p className="text-red-700">{error}</p>
              <button
                type="submit"
                className="mt-2 font-semibold text-primary-600"
              >
                Thử lại
              </button>
            </div>
          ) : null}
          {state === "completed" ? (
            <div>
              <p className="font-medium text-emerald-700">Ảnh đã tạo xong.</p>
              {job ? (
                <AiImageResult
                  job={job}
                  isBusy={isBusy}
                  onRegenerate={regenerate}
                  onInsert={onInsert}
                />
              ) : null}
            </div>
          ) : null}
        </section>
      </form>
    </aside>
  );
}

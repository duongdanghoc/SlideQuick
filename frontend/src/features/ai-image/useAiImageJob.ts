import { useCallback, useEffect, useRef, useState } from "react";
import {
  AiImageApiError,
  createImageJob,
  getImageJob,
  type CreateImageInput,
  type ImageJob,
} from "./api";
export type RequestState =
  | "idle"
  | "submitting"
  | "processing"
  | "completed"
  | "failed"
  | "timed_out";
const message = (e: unknown) =>
  e instanceof AiImageApiError
    ? e.message
    : "Không thể kết nối dịch vụ tạo ảnh. Vui lòng thử lại.";
export function useAiImageJob() {
  const [state, setState] = useState<RequestState>("idle");
  const [job, setJob] = useState<ImageJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const timer = useRef<number | null>(null);
  const started = useRef(0);
  const busy = useRef(false);
  const lastInput = useRef<CreateImageInput | null>(null);
  const clear = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    abort.current?.abort();
    abort.current = null;
  }, []);
  const poll = useCallback(async (id: string) => {
    if (Date.now() - started.current >= 90000) {
      busy.current = false;
      setState("timed_out");
      setError(
        "Quá trình tạo ảnh mất nhiều thời gian hơn dự kiến. Bạn có thể thử lại.",
      );
      return;
    }
    const c = new AbortController();
    abort.current = c;
    try {
      const next = await getImageJob(id, c.signal);
      setJob(next);
      if (next.status === "completed") {
        busy.current = false;
        setState("completed");
      } else if (next.status === "failed") {
        busy.current = false;
        setState("failed");
        setError(next.error?.message || "Tạo ảnh không thành công.");
      } else {
        setState("processing");
        timer.current = window.setTimeout(() => void poll(id), 2000);
      }
    } catch (e) {
      if (!c.signal.aborted) {
        busy.current = false;
        setState("failed");
        setError(message(e));
      }
    }
  }, []);
  const submit = useCallback(
    async (input: CreateImageInput) => {
      if (busy.current) return false;
      lastInput.current = { ...input };
      clear();
      busy.current = true;
      setError(null);
      setJob(null);
      setState("submitting");
      started.current = Date.now();
      const c = new AbortController();
      abort.current = c;
      try {
        const next = await createImageJob(input, crypto.randomUUID(), c.signal);
        setJob(next);
        if (next.status === "completed") {
          busy.current = false;
          setState("completed");
        } else if (next.status === "failed") {
          busy.current = false;
          setState("failed");
          setError(next.error?.message || "Tạo ảnh không thành công.");
        } else {
          setState("processing");
          timer.current = window.setTimeout(() => void poll(next.jobId), 1000);
        }
        return true;
      } catch (e) {
        if (!c.signal.aborted) {
          busy.current = false;
          setState("failed");
          setError(message(e));
        }
        return false;
      }
    },
    [clear, poll],
  );
  useEffect(() => clear, [clear]);
  const regenerate = useCallback(() => {
    if (!lastInput.current) return Promise.resolve(false);
    return submit(lastInput.current);
  }, [submit]);
  return {
    state,
    job,
    error,
    submit,
    regenerate,
    isBusy: state === "submitting" || state === "processing",
  };
}

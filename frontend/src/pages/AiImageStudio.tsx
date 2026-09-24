import { Sparkles } from "lucide-react";
import { Layout } from "../components/ui/Layout";
import { AiImagePanel } from "../features/ai-image/AiImagePanel";

export default function AiImageStudio() {
  return (
    <Layout>
      <section className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary-100 p-2 text-primary-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display text-slate-900">
              Tạo ảnh giáo dục bằng AI
            </h1>
            <p className="mt-1 text-slate-500">
              Tạo, xem trước và tải ảnh xuống mà không cần mở một dự án.
            </p>
          </div>
        </div>
      </section>

      <AiImagePanel variant="page" />
    </Layout>
  );
}

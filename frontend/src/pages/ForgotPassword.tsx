import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { BrandLogo } from "../components/ui/BrandLogo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Yêu cầu thất bại");
      }

      setMessage(data.message || "Nếu tài khoản tồn tại, email đã được gửi.");
    } catch (err: any) {
      setError(err.message || "Gửi email đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-primary-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <BrandLogo className="h-28 w-auto rounded-xl mb-12" />
          <h1 className="text-5xl font-bold font-display leading-tight mb-6">
            Khôi phục tài khoản
          </h1>
          <p className="text-primary-100 text-lg max-w-md">
            Đừng lo lắng. Chúng tôi sẽ giúp bạn quay lại tạo bài thuyết trình ngay.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-sm text-primary-100/60">
          <span>© 2024 EduArt AI</span>
          <span>Chính sách bảo mật</span>
          <span>Điều khoản sử dụng</span>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <BrandLogo className="h-24 w-auto mx-auto lg:hidden" />
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Quên mật khẩu?</h2>
            <p className="text-slate-500">
              Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
            </p>
          </div>

          {message ? (
            <div className="p-6 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center text-center space-y-3 animate-slide-up">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Kiểm tra email của bạn</h3>
                <p className="text-green-700 text-sm mt-1">{message}</p>
              </div>
              <Link
                to="/login"
                className="text-sm font-medium text-green-700 hover:text-green-800 underline mt-2"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Địa chỉ email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />

              {error && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 animate-slide-up">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full justify-center"
                size="lg"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Gửi liên kết đặt lại
              </Button>
            </form>
          )}

          {!message && (
            <div className="text-center text-sm text-slate-600">
              Nhớ mật khẩu rồi?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Lock, ArrowRight, LayoutTemplate } from "lucide-react";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        // Check for redirect URL from query param
        const redirectUrl = searchParams.get('redirect');
        navigate(redirectUrl || "/");
      } else {
        setError("Tên người dùng hoặc mật khẩu không hợp lệ");
      }
    } catch (err: any) {
      setError("Đăng nhập thất bại");
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
          <div className="flex items-center gap-2 mb-12">
            <LayoutTemplate className="w-8 h-8" />
            <span className="text-2xl font-bold font-display">EduArt AI</span>
          </div>
          <h1 className="text-5xl font-bold font-display leading-tight mb-6">
            Tạo bài thuyết trình<br />tuyệt vời trong tích tắc
          </h1>
          <p className="text-primary-100 text-lg max-w-md">
            Tiết kiệm thời gian với nền tảng tự động hóa slide thông minh
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-sm text-primary-100/60">
          <span>© 2024 EduArt AI</span>
          <span>Chính sách bảo mật</span>
          <span>Điều khoản sử dụng</span>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng trở lại</h2>
            <p className="text-slate-500">
              Nhập thông tin của bạn để đăng nhập.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Tên người dùng hoặc Email"
              name="username"
              type="text"
              placeholder="khang"
              value={formData.username}
              onChange={handleChange}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <div className="space-y-1">
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                placeholder="123456"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5" />}
                required
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

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
              Đăng nhập
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { BrandLogo } from "../components/ui/BrandLogo";

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useApp();

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

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp. Vui lòng thử lại.");
      return;
    }

    try {
      const success = await register(
        formData.username,
        formData.password,
        formData.email,
      );
      if (success) {
        navigate("/");
      } else {
        setError("Đăng ký thất bại");
      }
    } catch (err: any) {
      setError("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629904853716-600abd17529c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 transform scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>

        <div className="relative z-10">
          <BrandLogo className="h-28 w-auto rounded-xl mb-12" />
          <h1 className="text-5xl font-bold font-display leading-tight mb-6">
            Giải pháp chuẩn hóa
            <br />
            hình ảnh Giáo dục
          </h1>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-bold mb-2">Tự động định dạng</h3>
              <p className="text-zinc-400">
                Hãy để chúng tôi lo thiết kế, bạn tập trung vào nội dung.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Mẫu chuyên nghiệp</h3>
              <p className="text-zinc-400">
                Truy cập hàng trăm mẫu cao cấp cho mọi nhu cầu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <BrandLogo className="h-24 w-auto mx-auto lg:hidden" />
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Tạo tài khoản
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Tên người dùng"
              name="username"
              type="text"
              placeholder="Chọn tên người dùng"
              value={formData.username}
              onChange={handleChange}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              label="Địa chỉ email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              placeholder="Tạo mật khẩu"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <Input
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-5 h-5" />}
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
              Bắt đầu
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

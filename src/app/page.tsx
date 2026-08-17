"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/lib/auth";
import { PANEL_EMAIL } from "@/lib/seed";

export default function SignInPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(PANEL_EMAIL);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const message = await login(email, password, remember);
    setLoading(false);
    if (message) {
      setError(message);
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-dvh w-full flex-col md:h-dvh md:flex-row md:overflow-hidden">
        <div className="flex min-w-px flex-col items-start justify-between gap-[32px] self-stretch bg-[#0f172a] p-[24px] md:flex-1 md:p-[48px] xl:p-[64px] min-[1920px]:flex-[0.45]">
          <div className="flex items-center gap-[12px]">
            <div className="flex size-[48px] shrink-0 items-center justify-center overflow-clip rounded-[12px] bg-[#2563eb]">
              <Icon name="warehouse" size={28} alt="" />
            </div>
            <p className="font-[family-name:var(--font-epilogue)] text-[24px] font-bold whitespace-nowrap text-[#f8fafc]">
              Ombor Nazorati
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-[32px]">
            <div className="relative h-[180px] w-full overflow-hidden rounded-[16px] md:h-[220px] lg:h-[320px]">
              <img
                src="/assets/warehouse-hero.png"
                alt=""
                className="absolute inset-0 size-full rounded-[16px] object-cover"
              />
              <div className="absolute inset-0 bg-[#0f172a] opacity-40" />
            </div>
            <div className="flex w-full flex-col items-start gap-[12px]">
              <p className="w-full font-[family-name:var(--font-epilogue)] text-[24px] font-bold text-[#f8fafc] xl:text-[28px]">
                Aqlli Omborxona Boshqaruvi
              </p>
              <p className="w-full text-[15px] leading-[1.5] text-[#94a3b8] xl:text-[16px]">
                Barcha tovarlar harakati, kargo hisob-kitoblari va savdo
                ko&apos;rsatkichlari bitta tizimda mukammal nazorat ostida.
              </p>
            </div>
          </div>
          <p className="text-[14px] text-[#94a3b8]">
            © 2026 Ombor Nazorati. Barcha huquqlar himoyalangan.
          </p>
        </div>

        <div className="flex min-w-px flex-1 flex-col items-center justify-center bg-white px-[24px] py-[32px] md:p-[48px] xl:p-[80px] min-[1920px]:flex-[0.55]">
          <form
            onSubmit={onSubmit}
            className="flex w-full max-w-[420px] flex-col items-start gap-[24px] md:gap-[32px]"
          >
            <div className="flex w-full flex-col items-start gap-[8px]">
              <h1 className="w-full font-[family-name:var(--font-epilogue)] text-[24px] font-bold text-[#1e293b] md:text-[32px]">
                Tizimga kirish
              </h1>
              <p className="w-full text-[14px] text-[#64748b] md:text-[16px]">
                Elektron pochta va parolingizni kiriting
              </p>
            </div>
            <div className="flex w-full flex-col items-start gap-[20px]">
              <label className="flex w-full flex-col items-start gap-[8px]">
                <span className="w-full text-[14px] font-semibold text-[#1e293b]">
                  Elektron pochta
                </span>
                <div className="flex w-full items-center gap-[8px] rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] px-[16px] py-[12px]">
                  <span className="flex size-[20px] shrink-0 items-center justify-center overflow-clip">
                    <Icon name="mail" size={20} alt="" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-px flex-1 bg-transparent text-[15px] text-[#1e293b] outline-none"
                  />
                </div>
              </label>
              <label className="flex w-full flex-col items-start gap-[8px]">
                <span className="w-full text-[14px] font-semibold text-[#1e293b]">Parol</span>
                <div className="flex w-full items-center gap-[8px] rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] px-[16px] py-[12px]">
                  <span className="flex size-[20px] shrink-0 items-center justify-center overflow-clip">
                    <Icon name="lock" size={20} alt="" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-w-px flex-1 bg-transparent text-[15px] text-[#1e293b] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex size-[20px] shrink-0 items-center justify-center overflow-clip"
                  >
                    <Icon name="eye-off" size={20} alt="" />
                  </button>
                </div>
              </label>
              <div className="flex w-full flex-wrap items-center justify-between gap-[8px]">
                <button
                  type="button"
                  onClick={() => setRemember((v) => !v)}
                  className="flex items-center gap-[8px]"
                >
                  <span
                    className={`flex size-[20px] items-center justify-center overflow-clip rounded-[4px] ${
                      remember ? "bg-[#2563eb]" : "border border-[#cbd5e1] bg-white"
                    }`}
                  >
                    {remember ? <Icon name="check" size={14} alt="" /> : null}
                  </span>
                  <span className="text-[14px] text-[#64748b]">Meni eslab qol</span>
                </button>
                <button
                  type="button"
                  className="text-[14px] font-semibold text-[#2563eb]"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
            </div>
            {error ? <p className="text-[14px] text-[#b91c1c]">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-[8px] bg-[#2563eb] px-[24px] py-[14px] text-[16px] font-semibold text-white disabled:opacity-70"
            >
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>
        </div>
    </div>
  );
}

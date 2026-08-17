"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/format";

const tabs = [
  { id: "profil", label: "Profil" },
  { id: "kompaniya", label: "Kompaniya" },
  { id: "valyuta", label: "Valyuta kursi" },
  { id: "bildirishnoma", label: "Bildirishnomalar" },
  { id: "xavfsizlik", label: "Xavfsizlik" },
] as const;

export default function SettingsPage() {
  const { state, saveSettings } = useStore();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("profil");
  const [form, setForm] = useState(state.settings);
  const [saved, setSaved] = useState(false);

  async function persist(next = form) {
    await saveSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <AppShell title="Tizim sozlamalari">
      {() => (
        <div className="page-pad flex flex-col gap-[32px] xl:flex-row xl:items-start">
          <div className="flex w-full gap-[4px] overflow-x-auto xl:w-[220px] xl:shrink-0 xl:flex-col">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-[8px] px-[16px] py-[12px] text-left text-[14px] font-semibold whitespace-nowrap ${
                  tab === item.id ? "bg-[#2563eb] text-[#f8fafc]" : "text-[#64748b]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex min-w-px flex-1 flex-col gap-[24px]">
            {tab === "profil" ? (
              <div className="flex w-full flex-col gap-[24px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
                  Foydalanuvchi profili
                </p>
                <div className="flex items-center gap-[20px]">
                  <img
                    src={form.avatar}
                    alt=""
                    width={80}
                    height={80}
                    className="size-[80px] rounded-[40px] object-cover"
                  />
                  <div className="flex flex-col gap-[8px]">
                    <label className="cursor-pointer rounded-[6px] bg-[#2563eb] px-[16px] py-[8px] text-[13px] font-semibold text-[#f8fafc]">
                      Rasmni almashtirish
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setForm({ ...form, avatar: URL.createObjectURL(file) });
                        }}
                      />
                    </label>
                    <p className="text-[12px] text-[#94a3b8]">
                      Format: JPG, PNG. Maksimal hajm 2MB.
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-[16px]">
                  <div className="flex w-full flex-col gap-[20px] md:flex-row">
                    <Field label="Ism">
                      <input
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="field bg-[#f1f5f9]"
                      />
                    </Field>
                    <Field label="Familiya">
                      <input
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="field bg-[#f1f5f9]"
                      />
                    </Field>
                  </div>
                  <div className="flex w-full flex-col gap-[20px] md:flex-row">
                    <Field label="Elektron pochta">
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="field bg-[#f1f5f9]"
                      />
                    </Field>
                    <Field label="Telefon">
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="field bg-[#f1f5f9]"
                      />
                    </Field>
                  </div>
                  <Field label="Rol (Tahrirlab bo'lmaydi)">
                    <div className="field-readonly opacity-60">{form.role}</div>
                  </Field>
                </div>
                <div className="flex gap-[12px]">
                  <button
                    type="button"
                    onClick={() => persist()}
                    className="rounded-[6px] bg-[#2563eb] px-[24px] py-[10px] text-[14px] font-semibold text-[#f8fafc]"
                  >
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(state.settings)}
                    className="rounded-[6px] border border-[#e2e8f0] bg-white px-[24px] py-[10px] text-[14px] font-semibold text-[#1e293b]"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            ) : null}

            {tab === "kompaniya" ? (
              <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
                  Kompaniya ma&apos;lumotlari
                </p>
                <Field label="Kompaniya nomi">
                  <input
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="field bg-[#f1f5f9]"
                  />
                </Field>
                <Field label="Manzil">
                  <input
                    value={form.companyAddress}
                    onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                    className="field bg-[#f1f5f9]"
                  />
                </Field>
                <Link
                  href="/admins"
                  className="w-fit text-[14px] font-semibold text-[#2563eb]"
                >
                  Adminlar ro&apos;yxatini ochish
                </Link>
                <button
                  type="button"
                  onClick={() => persist()}
                  className="w-fit rounded-[6px] bg-[#2563eb] px-[24px] py-[10px] text-[14px] font-semibold text-[#f8fafc]"
                >
                  Saqlash
                </button>
              </div>
            ) : null}

            {tab === "valyuta" || tab === "profil" ? (
              <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="font-[family-name:var(--font-epilogue)] text-[16px] font-bold text-[#1e293b]">
                  Valyuta kursi sozlamalari
                </p>
                <div className="flex w-full flex-col items-start justify-between gap-[16px] lg:flex-row lg:items-center">
                  <div className="flex flex-wrap items-center gap-[12px]">
                    <p className="text-[15px] font-semibold text-[#1e293b]">1 USD =</p>
                    <input
                      value={form.usdRate}
                      onChange={(e) =>
                        setForm({ ...form, usdRate: Number(e.target.value) || 0 })
                      }
                      className="w-[140px] rounded-[6px] border border-[#e2e8f0] bg-[#f1f5f9] px-[16px] py-[8px] text-[14px] font-bold text-[#1e293b]"
                    />
                    <span className="text-[14px] text-[#1e293b]">so&apos;m</span>
                  </div>
                  <div className="flex items-center gap-[16px]">
                    <p className="text-[12px] text-[#94a3b8]">
                      Oxirgi yangilangan: {form.rateUpdatedAt}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        persist({
                          ...form,
                          rateUpdatedAt: formatDate(new Date()),
                        })
                      }
                      className="rounded-[6px] bg-[rgba(37,99,235,0.1)] px-[16px] py-[8px] text-[13px] font-semibold text-[#2563eb]"
                    >
                      Yangilash
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "bildirishnoma" ? (
              <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
                  Bildirishnomalar
                </p>
                {[
                  ["notifySales", "Yangi sotuvlar haqida"] as const,
                  ["notifyDebts", "Qarz muddati haqida"] as const,
                  ["notifyLowStock", "Kam qolgan tovarlar"] as const,
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-[14px] text-[#1e293b]">{label}</span>
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => persist()}
                  className="w-fit rounded-[6px] bg-[#2563eb] px-[24px] py-[10px] text-[14px] font-semibold text-[#f8fafc]"
                >
                  Saqlash
                </button>
              </div>
            ) : null}

            {tab === "xavfsizlik" ? (
              <div className="flex w-full flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
                  Xavfsizlik
                </p>
                <p className="text-[14px] text-[#64748b]">
                  Kirish email: {form.email}. Parolni Supabase Auth orqali yangilang.
                </p>
              </div>
            ) : null}

            {saved ? <p className="text-[13px] text-[#15803d]">Saqlandi</p> : null}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-px flex-1 flex-col gap-[8px]">
      <span className="text-[13px] font-semibold text-[#1e293b]">{label}</span>
      {children}
    </label>
  );
}

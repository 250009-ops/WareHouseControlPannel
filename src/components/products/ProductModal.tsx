"use client";

import { useMemo, useState } from "react";
import { Icon } from "../Icon";
import { brands, colors } from "@/lib/seed";
import { chinaUzs, formatUzs } from "@/lib/format";
import type { Product } from "@/lib/types";

const empty: Omit<Product, "id"> = {
  name: "",
  brand: "Bata",
  size: "",
  color: "Qora",
  chinaUsd: 0,
  cargoUsd: 0,
  costUzs: 0,
  sellUzs: 0,
  soldUzs: null,
  status: "Sotilmagan",
  debt: "To'lanmagan",
  image: "/assets/products/1.png",
};

export function ProductModal({
  product,
  rate,
  onClose,
  onSave,
}: {
  product: Product | null;
  rate: number;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
}) {
  const [form, setForm] = useState<Omit<Product, "id">>(
    product ? { ...product } : empty,
  );
  const chinaSom = useMemo(
    () => chinaUzs(form.chinaUsd, rate),
    [form.chinaUsd, rate],
  );

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[rgba(15,23,42,0.6)] md:items-center md:p-[24px]">
      <div className="flex max-h-[100vh] w-full flex-col items-start gap-[24px] overflow-y-auto rounded-t-[16px] bg-white p-[20px] shadow-[0px_16px_16px_rgba(0,0,0,0.25)] md:max-h-[90vh] md:w-[720px] md:rounded-[16px] md:p-[32px]">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-[family-name:var(--font-epilogue)] text-[20px] font-bold text-[#1e293b]">
            {product ? "Tovarni tahrirlash" : "Yangi tovar qo'shish"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-[16px] bg-[#f1f5f9]"
          >
            <Icon name="x" size={14} alt="" />
          </button>
        </div>
        <div className="flex w-full flex-col items-start gap-[24px] md:flex-row">
          <div className="flex min-w-px flex-1 flex-col gap-[16px]">
            <Field label="Tovar nomi">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: Erkaklar charm poyabzali"
                className="field"
              />
            </Field>
            <Field label="Brendi">
              <div className="relative">
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="field appearance-none pr-[36px]"
                >
                  {brands.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2">
                  <Icon name="chevron-down" size={16} alt="" />
                </span>
              </div>
            </Field>
            <div className="flex w-full flex-col gap-[16px] sm:flex-row">
              <Field label="Razmeri">
                <input
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="field"
                />
              </Field>
              <Field label="Rangi">
                <div className="relative">
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="field appearance-none pr-[36px]"
                  >
                    {colors.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2">
                    <Icon name="chevron-down" size={16} alt="" />
                  </span>
                </div>
              </Field>
            </div>
            <Field label="Tovar rasmi">
              {product ? (
                <div className="flex items-center gap-[16px] rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] p-[12px]">
                  <img
                    src={form.image}
                    alt=""
                    width={48}
                    height={48}
                    className="size-[48px] rounded-[4px] object-cover"
                  />
                  <div className="flex flex-col gap-[4px]">
                    <p className="text-[13px] font-semibold text-[#1e293b]">
                      {form.imageName ?? "product.png"}
                    </p>
                    <p className="text-[11px] text-[#94a3b8]">O&apos;lcham: 240 KB</p>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[8px] border border-dashed border-[#94a3b8] bg-[#f1f5f9] p-[20px]">
                  <Icon name="image" size={24} alt="" />
                  <p className="text-[12px] text-[#64748b]">
                    Rasm yuklash yoki sudrab o&apos;tish
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setForm({ ...form, image: url, imageName: file.name });
                    }}
                  />
                </label>
              )}
            </Field>
          </div>
          <div className="flex min-w-px flex-1 flex-col gap-[16px]">
            <div className="flex flex-col gap-[16px] sm:flex-row">
              <Field label="Xitoy narxi (USD)">
                <input
                  type="number"
                  step="0.01"
                  value={form.chinaUsd || ""}
                  onChange={(e) =>
                    setForm({ ...form, chinaUsd: Number(e.target.value) })
                  }
                  className="field"
                />
              </Field>
              <Field label="Kargo narxi (USD)">
                <input
                  type="number"
                  step="0.01"
                  value={form.cargoUsd || ""}
                  onChange={(e) =>
                    setForm({ ...form, cargoUsd: Number(e.target.value) })
                  }
                  className="field"
                />
              </Field>
            </div>
            <Field label="Valyuta kursi (avtomat)">
              <div className="field-readonly">
                1 USD = {formatUzs(rate)} so&apos;m
              </div>
            </Field>
            <Field label="Xitoydagi narxi so'mda (hisoblangan)">
              <div className="field-readonly">{formatUzs(chinaSom)} so&apos;m</div>
            </Field>
            <div className="flex flex-col gap-[16px] sm:flex-row">
              <Field label="Tan narxi (so'm)">
                <input
                  type="number"
                  value={form.costUzs || ""}
                  onChange={(e) =>
                    setForm({ ...form, costUzs: Number(e.target.value) })
                  }
                  className="field"
                />
              </Field>
              <Field label="Sotish narxi (so'm)">
                <input
                  type="number"
                  value={form.sellUzs || ""}
                  onChange={(e) =>
                    setForm({ ...form, sellUzs: Number(e.target.value) })
                  }
                  className="field"
                />
              </Field>
            </div>
          </div>
        </div>
        <div className="flex w-full items-start justify-end gap-[12px]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-[#e2e8f0] bg-white px-[24px] py-[10px] text-[14px] font-semibold text-[#1e293b]"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                ...form,
                id: product?.id ?? crypto.randomUUID(),
              })
            }
            className="rounded-[6px] bg-[#2563eb] px-[24px] py-[10px] text-[14px] font-semibold text-[#f8fafc]"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
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
    <label className="flex w-full flex-col items-start gap-[8px]">
      <span className="text-[13px] font-semibold text-[#1e293b]">{label}</span>
      {children}
    </label>
  );
}

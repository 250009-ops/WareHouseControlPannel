"use client";

import { useState } from "react";
import { Icon } from "../Icon";
import type { Admin, AdminRole, Debt, DebtStatus, PaymentType, Product, Sale, SaleStatus } from "@/lib/types";

function Overlay({
  title,
  onClose,
  children,
  onSave,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[rgba(15,23,42,0.6)] md:items-center md:p-[24px]">
      <div className="flex max-h-[100vh] w-full flex-col gap-[24px] overflow-y-auto rounded-t-[16px] bg-white p-[20px] shadow-[0px_16px_16px_rgba(0,0,0,0.25)] md:max-h-[90vh] md:w-[560px] md:rounded-[16px] md:p-[32px]">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-epilogue)] text-[20px] font-bold text-[#1e293b]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-[16px] bg-[#f1f5f9]"
          >
            <Icon name="x" size={14} alt="" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">{children}</div>
        <div className="flex justify-end gap-[12px]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-[#e2e8f0] bg-white px-[24px] py-[10px] text-[14px] font-semibold text-[#1e293b]"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-[6px] bg-[#2563eb] px-[24px] py-[10px] text-[14px] font-semibold text-[#f8fafc]"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-[13px] font-semibold text-[#1e293b]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}

export function SaleModal({
  sale,
  products,
  onClose,
  onSave,
}: {
  sale: Sale | null;
  products: Product[];
  onClose: () => void;
  onSave: (sale: Sale) => Promise<void>;
}) {
  const [form, setForm] = useState<Sale>(
    sale ?? {
      id: crypto.randomUUID(),
      date: "16.08.2026",
      productId: products[0]?.id ?? "",
      quantity: 1,
      sellPrice: products[0]?.sellUzs ?? 0,
      soldPrice: products[0]?.sellUzs ?? 0,
      paymentType: "Naqd",
      customer: "",
      status: "Tasdiqlangan",
    },
  );

  return (
    <Overlay
      title={sale ? "Sotuvni tahrirlash" : "Yangi sotuv"}
      onClose={onClose}
      onSave={() => onSave(form)}
    >
      <label className="col-span-2 flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">Tovar</span>
        <select
          value={form.productId}
          onChange={(e) => {
            const product = products.find((p) => p.id === e.target.value);
            setForm({
              ...form,
              productId: e.target.value,
              sellPrice: product?.sellUzs ?? form.sellPrice,
              soldPrice: product?.sellUzs ?? form.soldPrice,
            });
          }}
          className="field"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <Input label="Sana" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
      <Input
        label="Xaridor"
        value={form.customer}
        onChange={(v) => setForm({ ...form, customer: v })}
      />
      <Input
        label="Miqdori"
        type="number"
        value={form.quantity}
        onChange={(v) => setForm({ ...form, quantity: Number(v) })}
      />
      <Input
        label="Sotilgan narxi"
        type="number"
        value={form.soldPrice}
        onChange={(v) => setForm({ ...form, soldPrice: Number(v) })}
      />
      <label className="flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">To&apos;lov turi</span>
        <select
          value={form.paymentType}
          onChange={(e) => setForm({ ...form, paymentType: e.target.value as PaymentType })}
          className="field"
        >
          <option>Naqd</option>
          <option>Karta</option>
          <option>Qarz</option>
        </select>
      </label>
      <label className="flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">Holati</span>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as SaleStatus })}
          className="field"
        >
          <option>Tasdiqlangan</option>
          <option>Bekor qilingan</option>
        </select>
      </label>
    </Overlay>
  );
}

export function DebtModal({
  debt,
  products,
  onClose,
  onSave,
}: {
  debt: Debt | null;
  products: Product[];
  onClose: () => void;
  onSave: (debt: Debt) => Promise<void>;
}) {
  const [form, setForm] = useState<Debt>(
    debt ?? {
      id: crypto.randomUUID(),
      debtor: "",
      phone: "+998 ",
      productId: products[0]?.id ?? "",
      amount: products[0]?.sellUzs ?? 0,
      issuedAt: "16.08.2026",
      dueAt: "31.08.2026",
      paid: 0,
      status: "Jarayonda",
    },
  );

  return (
    <Overlay
      title={debt ? "Qarzni tahrirlash" : "Yangi qarz"}
      onClose={onClose}
      onSave={() => onSave(form)}
    >
      <Input label="Qarzdor ismi" value={form.debtor} onChange={(v) => setForm({ ...form, debtor: v })} />
      <Input label="Telefon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
      <label className="col-span-2 flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">Tovar</span>
        <select
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
          className="field"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <Input
        label="Qarz summasi"
        type="number"
        value={form.amount}
        onChange={(v) => setForm({ ...form, amount: Number(v) })}
      />
      <Input
        label="To'langan"
        type="number"
        value={form.paid}
        onChange={(v) => setForm({ ...form, paid: Number(v) })}
      />
      <Input label="Berilgan sana" value={form.issuedAt} onChange={(v) => setForm({ ...form, issuedAt: v })} />
      <Input label="Muddat" value={form.dueAt} onChange={(v) => setForm({ ...form, dueAt: v })} />
      <label className="col-span-2 flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">Holati</span>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as DebtStatus })}
          className="field"
        >
          <option>Jarayonda</option>
          <option>To&apos;langan</option>
          <option>Muddati o&apos;tgan</option>
        </select>
      </label>
    </Overlay>
  );
}

export function AdminModal({
  admin,
  onClose,
  onSave,
}: {
  admin: Admin | null;
  onClose: () => void;
  onSave: (admin: Admin) => Promise<void>;
}) {
  const [form, setForm] = useState<Admin>(
    admin ?? {
      id: crypto.randomUUID(),
      firstName: "",
      lastName: "",
      email: "",
      phone: "+998 ",
      role: "Admin",
      status: "Active",
      joinedAt: "16.08.2026",
      avatar: "/assets/avatars/akbar.png",
    },
  );

  return (
    <Overlay
      title={admin ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
      onClose={onClose}
      onSave={() => onSave(form)}
    >
      <Input label="Ism" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
      <Input label="Familiya" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
      <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      <Input label="Telefon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
      <label className="flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">Rol</span>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
          className="field"
        >
          <option>Super Admin</option>
          <option>Admin</option>
          <option>Moderator</option>
        </select>
      </label>
      <label className="flex flex-col gap-[8px]">
        <span className="text-[13px] font-semibold text-[#1e293b]">Holati</span>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Admin["status"] })}
          className="field"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </label>
    </Overlay>
  );
}

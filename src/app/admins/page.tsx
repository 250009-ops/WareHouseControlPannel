"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/Icon";
import { AdminModal } from "@/components/forms/EntityModals";
import { useStore } from "@/lib/store";
import { formatUzs } from "@/lib/format";
import type { Admin } from "@/lib/types";

function roleTone(role: Admin["role"]) {
  if (role === "Super Admin") return "super" as const;
  if (role === "Admin") return "admin" as const;
  return "moderator" as const;
}

export default function AdminsPage() {
  const { state, kpis, saveAdmin, deleteAdmin } = useStore();
  const [modal, setModal] = useState<Admin | null | "new">(null);

  return (
    <AppShell title="Adminlar & Hisobotlar">
      {(search) => {
        const admins = state.admins.filter((a) => {
          const q = search.toLowerCase();
          return (
            !q ||
            `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q)
          );
        });
        return (
          <div className="page-pad flex flex-col gap-[24px]">
            <div className="toolbar-row">
              <div>
                <h2 className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
                  Adminlar Ro&apos;yxati
                </h2>
                <p className="text-[14px] text-[#64748b]">
                  Tizimga kirish huquqiga ega bo&apos;lgan foydalanuvchilar
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal("new")}
                className="flex items-center gap-[8px] rounded-[8px] bg-[#2563eb] px-[20px] py-[8px] text-[14px] font-semibold text-white"
              >
                <Icon name="user-plus" size={16} alt="" />
                + Yangi admin qo&apos;shish
              </button>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                <thead className="bg-[#f8fafc] text-[12px] font-semibold text-[#64748b]">
                  <tr>
                    {["#", "Ism", "Email", "Rol", "Holati", "Qo'shilgan sana", "Amallar"].map(
                      (h) => (
                        <th key={h} className="px-[16px] py-[14px]">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={admin.id} className="border-t border-[#e2e8f0] text-[14px]">
                      <td className="px-[16px] py-[16px] text-[#64748b]">{index + 1}</td>
                      <td className="px-[16px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <img
                            src={admin.avatar}
                            alt=""
                            width={32}
                            height={32}
                            className="size-[32px] rounded-full object-cover"
                          />
                          <span className="font-semibold text-[#1e293b]">
                            {admin.firstName} {admin.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-[16px] py-[16px] text-[#64748b]">{admin.email}</td>
                      <td className="px-[16px] py-[16px]">
                        <Badge tone={roleTone(admin.role)}>{admin.role}</Badge>
                      </td>
                      <td className="px-[16px] py-[16px]">
                        <Badge tone={admin.status === "Active" ? "active" : "inactive"}>
                          {admin.status}
                        </Badge>
                      </td>
                      <td className="px-[16px] py-[16px] text-[#64748b]">{admin.joinedAt}</td>
                      <td className="px-[16px] py-[16px]">
                        <div className="flex gap-[8px]">
                          <button
                            type="button"
                            onClick={() => setModal(admin)}
                            className="flex size-[32px] items-center justify-center rounded-[8px] bg-[#f1f5f9]"
                          >
                            <Icon name="edit-2" size={16} alt="" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAdmin(admin.id)}
                            className="flex size-[32px] items-center justify-center rounded-[8px] bg-[#fef2f2]"
                          >
                            <Icon name="trash-2" size={16} alt="" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
              Oylik Hisobotlar & Tahlillar
            </p>
            <div className="split-2">
              <div className="flex min-w-px flex-1 flex-col rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="text-[16px] font-bold text-[#1e293b]">Oylik Foyda Tahlili (UZS)</p>
                <div className="mt-[16px] flex flex-col gap-[12px] sm:flex-row sm:justify-between">
                  <Stat label="Jami kirim" value={formatUzs(kpis.revenue)} color="text-[#15803d]" />
                  <Stat label="Chiqim" value={formatUzs(kpis.expenses)} color="text-[#b91c1c]" />
                  <Stat label="Sof foyda" value={formatUzs(kpis.monthlyProfit)} color="text-[#2563eb]" />
                </div>
                <div className="mt-[36px] flex h-[141px] items-end justify-center gap-[32px]">
                  <Bar label="Kirim" height={120} color="#22c55e" />
                  <Bar label="Chiqim" height={75} color="#ef4444" />
                  <Bar label="Sof foyda" height={45} color="#2563eb" />
                </div>
              </div>
              <div className="flex min-w-px flex-1 flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
                <p className="text-[16px] font-bold text-[#1e293b]">Oylik Harajatlar Tarkibi</p>
                {[
                  ["Kargo yetkazib berish (Xitoy)", "32,400,000 so'm", 220, "#ef4444"],
                  ["Omborxona ijara to'lovi", "25,000,000 so'm", 170, "#f59e0b"],
                  ["Ishchilar oylik maoshlari", "17,900,000 so'm", 110, "#2563eb"],
                ].map(([label, value, width, color]) => (
                  <div key={label} className="flex flex-col gap-[8px]">
                    <div className="flex justify-between text-[14px]">
                      <span>{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                    <div className="h-[6px] overflow-hidden rounded-full bg-[#f1f5f9]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: Number(width), background: String(color) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {modal !== null ? (
              <AdminModal
                admin={modal === "new" ? null : modal}
                onClose={() => setModal(null)}
                onSave={async (admin) => {
                  await saveAdmin(admin);
                  setModal(null);
                }}
              />
            ) : null}
          </div>
        );
      }}
    </AppShell>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <p className="text-[13px] text-[#64748b]">{label}</p>
      <p className={`text-[18px] font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Bar({
  label,
  height,
  color,
}: {
  label: string;
  height: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[36px] rounded-t-[4px]" style={{ height, background: color }} />
      <p className="mt-[8px] text-[12px] text-[#64748b]">{label}</p>
    </div>
  );
}

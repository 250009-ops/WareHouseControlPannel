"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { DebtModal } from "@/components/forms/EntityModals";
import { useStore } from "@/lib/store";
import { formatUzsLabel } from "@/lib/format";
import type { Debt } from "@/lib/types";

function debtTone(status: Debt["status"]) {
  if (status === "To'langan") return "paid" as const;
  if (status === "Muddati o'tgan") return "overdue" as const;
  return "progress" as const;
}

export default function DebtsPage() {
  const { state, kpis, productById, saveDebt } = useStore();
  const [modal, setModal] = useState<Debt | null | "new">(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [debtorQuery, setDebtorQuery] = useState("");

  return (
    <AppShell title="Qarzlar Bo'limi">
      {(search) => {
        const filtered = state.debts.filter((d) => {
          const product = productById(d.productId);
          const q = (search || debtorQuery).toLowerCase();
          const matches =
            !q ||
            d.debtor.toLowerCase().includes(q) ||
            d.phone.includes(q) ||
            product?.name.toLowerCase().includes(q);
          const matchesStatus = statusFilter === "all" || d.status === statusFilter;
          return matches && matchesStatus;
        });

        return (
          <div className="page-pad flex flex-col gap-[24px]">
            <div className="kpi-grid-3">
              <KpiCard
                label="Jami qarz"
                value={`${kpis.totalDebt.toLocaleString("en-US")} so'm`}
                icon="credit-card"
                iconBg="#dbeafe"
              />
              <KpiCard
                label="To'langan"
                value={`${kpis.paidDebt.toLocaleString("en-US")} so'm`}
                icon="check"
                iconBg="#dcfce7"
              />
              <KpiCard
                label="Qolgan qarz"
                value={`${kpis.remainingDebt.toLocaleString("en-US")} so'm`}
                icon="arrow-down-right"
                iconBg="#fee2e2"
              />
            </div>
            <div className="toolbar-row rounded-[12px] border border-[#e2e8f0] bg-white px-[16px] py-[16px] md:px-[20px] md:py-[20px]">
              <div className="flex flex-wrap items-center gap-[12px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-[8px] border border-[#e2e8f0] px-[16px] py-[8px] text-[14px] text-[#1e293b]"
                >
                  <option value="all">Holat bo&apos;yicha</option>
                  <option value="Jarayonda">Jarayonda</option>
                  <option value="To'langan">To&apos;langan</option>
                  <option value="Muddati o'tgan">Muddati o&apos;tgan</option>
                </select>
                <input
                  value={debtorQuery}
                  onChange={(e) => setDebtorQuery(e.target.value)}
                  placeholder="Qarzdor qidirish..."
                  className="w-full max-w-[240px] rounded-[8px] border border-[#e2e8f0] px-[16px] py-[8px] text-[14px] outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setModal("new")}
                className="rounded-[8px] bg-[#2563eb] px-[20px] py-[8px] text-[14px] font-semibold text-white"
              >
                + Yangi qarz
              </button>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="bg-[#f8fafc] text-[12px] font-semibold text-[#64748b]">
                    <tr>
                      {[
                        "#",
                        "Qarzdor ismi",
                        "Telefon",
                        "Tovar nomi",
                        "Qarz summasi",
                        "Berilgan sana",
                        "Muddat",
                        "To'langan",
                        "Qoldiq",
                        "Holati",
                      ].map((h) => (
                        <th key={h} className="px-[16px] py-[14px] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((debt, index) => {
                      const product = productById(debt.productId);
                      return (
                        <tr
                          key={debt.id}
                          onClick={() => setModal(debt)}
                          className="cursor-pointer border-t border-[#e2e8f0] text-[13px] hover:bg-[#f8fafc]"
                        >
                          <td className="px-[16px] py-[12px] text-[#64748b]">{index + 1}</td>
                          <td className="px-[16px] py-[12px] font-semibold text-[#1e293b]">
                            {debt.debtor}
                          </td>
                          <td className="px-[16px] py-[12px] text-[#64748b]">{debt.phone}</td>
                          <td className="px-[16px] py-[12px]">{product?.name}</td>
                          <td className="px-[16px] py-[12px] text-right font-semibold">
                            {formatUzsLabel(debt.amount)}
                          </td>
                          <td className="px-[16px] py-[12px] text-center text-[#64748b]">
                            {debt.issuedAt}
                          </td>
                          <td className="px-[16px] py-[12px] text-center text-[#64748b]">
                            {debt.dueAt}
                          </td>
                          <td className="px-[16px] py-[12px] text-right text-[#15803d]">
                            {formatUzsLabel(debt.paid)}
                          </td>
                          <td className="px-[16px] py-[12px] text-right font-semibold text-[#b91c1c]">
                            {formatUzsLabel(debt.amount - debt.paid)}
                          </td>
                          <td className="px-[16px] py-[12px] text-center">
                            <Badge tone={debtTone(debt.status)}>{debt.status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {modal !== null ? (
              <DebtModal
                debt={modal === "new" ? null : modal}
                products={state.products}
                onClose={() => setModal(null)}
                onSave={async (debt) => {
                  await saveDebt(debt);
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

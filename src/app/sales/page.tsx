"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SaleModal } from "@/components/forms/EntityModals";
import { useStore } from "@/lib/store";
import { formatUzsLabel } from "@/lib/format";
import type { Sale } from "@/lib/types";

const PAGE_SIZE = 6;

function paymentTone(type: Sale["paymentType"]) {
  if (type === "Naqd") return "cash" as const;
  if (type === "Karta") return "card" as const;
  return "debt" as const;
}

export default function SalesPage() {
  const { state, kpis, productById, saveSale } = useStore();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Sale | null | "new">(null);

  return (
    <AppShell title="Sotuvlar Bo'limi">
      {(search) => {
        const filtered = state.sales.filter((s) => {
          const product = productById(s.productId);
          const q = search.toLowerCase();
          return (
            !q ||
            s.customer.toLowerCase().includes(q) ||
            product?.name.toLowerCase().includes(q) ||
            product?.brand.toLowerCase().includes(q)
          );
        });
        const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        const start = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;
        const end = Math.min(page * PAGE_SIZE, filtered.length);

        return (
          <div className="page-pad flex flex-col gap-[24px]">
            <div className="kpi-grid-3">
              <KpiCard
                label="Bugungi sotuv"
                value={`${kpis.todaySales.toLocaleString("en-US")} so'm`}
                icon="trending-up"
                iconBg="#dbeafe"
              />
              <KpiCard
                label="Oylik sotuv"
                value={`${kpis.monthlySales.toLocaleString("en-US")} so'm`}
                icon="shopping-bag"
                iconBg="#dcfce7"
              />
              <KpiCard
                label="O'rtacha chek"
                value={`${kpis.averageCheck.toLocaleString("en-US")} so'm`}
                icon="receipt"
                iconBg="#ffedd5"
              />
            </div>
            <div className="toolbar-row rounded-[12px] border border-[#e2e8f0] bg-white px-[16px] py-[16px] md:px-[20px] md:py-[20px]">
              <div className="flex flex-wrap items-center gap-[12px]">
                <div className="rounded-[8px] border border-[#e2e8f0] px-[16px] py-[8px] text-[14px] text-[#1e293b]">
                  Avgust 2026
                </div>
                <div className="rounded-[8px] border border-[#e2e8f0] px-[16px] py-[8px] text-[14px] text-[#1e293b]">
                  Filtrlar
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModal("new")}
                className="rounded-[8px] bg-[#2563eb] px-[20px] py-[8px] text-[14px] font-semibold text-white"
              >
                + Yangi sotuv
              </button>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="bg-[#f8fafc] text-[12px] font-semibold text-[#64748b]">
                    <tr>
                      {[
                        "#",
                        "Sana",
                        "Tovar nomi",
                        "Brendi",
                        "Miqdori",
                        "Sotish narxi",
                        "Sotilgan narxi",
                        "To'lov turi",
                        "Xaridor",
                        "Holati",
                      ].map((h) => (
                        <th key={h} className="px-[16px] py-[14px] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((sale, index) => {
                      const product = productById(sale.productId);
                      return (
                        <tr
                          key={sale.id}
                          onClick={() => setModal(sale)}
                          className="cursor-pointer border-t border-[#e2e8f0] text-[13px] hover:bg-[#f8fafc]"
                        >
                          <td className="px-[16px] py-[12px] text-[#64748b]">
                            {(page - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="px-[16px] py-[12px] text-[#64748b]">{sale.date}</td>
                          <td className="px-[16px] py-[12px] font-semibold text-[#1e293b]">
                            {product?.name}
                          </td>
                          <td className="px-[16px] py-[12px] text-[#64748b]">{product?.brand}</td>
                          <td className="px-[16px] py-[12px] text-center">{sale.quantity}</td>
                          <td className="px-[16px] py-[12px] text-right text-[#64748b]">
                            {formatUzsLabel(sale.sellPrice)}
                          </td>
                          <td className="px-[16px] py-[12px] text-right font-semibold text-[#2563eb]">
                            {formatUzsLabel(sale.soldPrice)}
                          </td>
                          <td className="px-[16px] py-[12px] text-center">
                            <Badge tone={paymentTone(sale.paymentType)}>{sale.paymentType}</Badge>
                          </td>
                          <td className="px-[16px] py-[12px]">{sale.customer}</td>
                          <td className="px-[16px] py-[12px] text-center">
                            <Badge tone={sale.status === "Tasdiqlangan" ? "confirmed" : "cancelled"}>
                              {sale.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                label={`Jami ${filtered.length} ta sotuvdan ${start}-${end} ko'rsatilmoqda`}
                page={page}
                pages={pages}
                onPage={setPage}
              />
            </div>
            {modal !== null ? (
              <SaleModal
                sale={modal === "new" ? null : modal}
                products={state.products}
                onClose={() => setModal(null)}
                onSave={async (sale) => {
                  await saveSale(sale);
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

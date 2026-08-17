"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Icon } from "@/components/Icon";
import { useStore } from "@/lib/store";
import { formatUzs, monthLabel, netProfit } from "@/lib/format";

const weeks = [
  { label: "Hafta 1", h: 40 },
  { label: "Hafta 2", h: 85 },
  { label: "Hafta 3", h: 120 },
  { label: "Hafta 4", h: 60 },
];

const expenses = [
  { label: "Xitoy xaridi", value: 58, color: "#2563eb", width: 162 },
  { label: "Kargo", value: 12, color: "#b45309", width: 34 },
  { label: "Ombor ijarasi", value: 18, color: "#6b21a8", width: 50 },
  { label: "Ish haqi", value: 8, color: "#15803d", width: 22 },
  { label: "Boshqa", value: 4, color: "#64748b", width: 11 },
];

export default function ReportsPage() {
  const { state, kpis } = useStore();
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));

  const topSold = useMemo(() => {
    const map = new Map<
      string,
      { name: string; count: number; total: number; profit: number }
    >();
    for (const sale of state.sales.filter((s) => s.status === "Tasdiqlangan")) {
      const product = state.products.find((p) => p.id === sale.productId);
      if (!product) continue;
      const current = map.get(product.id) ?? {
        name: product.name,
        count: 0,
        total: 0,
        profit: 0,
      };
      current.count += sale.quantity;
      current.total += sale.soldPrice;
      current.profit += (netProfit(product) ?? 0) * sale.quantity;
      map.set(product.id, current);
    }
    const rows = [...map.values()].sort((a, b) => b.count - a.count);
    if (rows.length) return rows;
    return [
      { name: "Erkaklar charm botinkasi", count: 120, total: 54000000, profit: 21240000 },
      { name: "Ayollar bahorgi kurtkasi", count: 95, total: 36100000, profit: 15228500 },
      { name: "Premium klassik ko'ylak", count: 80, total: 23200000, profit: 10024000 },
      { name: "Klassik qora hudi", count: 75, total: 18000000, profit: 8100000 },
      { name: "Djinsi slim-fit", count: 40, total: 12400000, profit: 5040000 },
    ];
  }, [state]);

  return (
    <AppShell title="Hisobotlar & Analitika">
      {() => (
        <div className="page-pad flex flex-col gap-[24px]">
          <div className="flex items-center gap-[16px]">
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
              className="flex size-[36px] items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-white"
            >
              <Icon name="chevron-left" size={16} alt="" />
            </button>
            <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
              {monthLabel(cursor)}
            </p>
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
              className="flex size-[36px] items-center justify-center rounded-[18px] border border-[#e2e8f0] bg-white"
            >
              <Icon name="chevron-right" size={16} alt="" />
            </button>
          </div>
          <div className="kpi-grid">
            <Summary label="Jami daromad" value={`${formatUzs(kpis.revenue)} UZS`} />
            <Summary
              label="Jami harajat"
              value={`${formatUzs(kpis.expenses)} UZS`}
              color="text-[#b91c1c]"
            />
            <Summary
              label="Sof foyda"
              value={`${formatUzs(kpis.monthlyProfit)} UZS`}
              color="text-[#15803d]"
            />
            <Summary
              label="Foyda marjasi"
              value={`${kpis.margin}%`}
              color="text-[#2563eb]"
            />
          </div>
          <div className="split-2">
            <div className="flex min-w-px flex-1 flex-col gap-[20px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
              <p className="font-[family-name:var(--font-epilogue)] text-[16px] font-bold text-[#1e293b]">
                Oylik sotuv dinamikasi (Haftalar kesimida)
              </p>
              <div className="flex h-[150px] w-full items-end justify-center gap-[32px]">
                {weeks.map((week) => (
                  <div key={week.label} className="flex flex-col items-center gap-[8px]">
                    <div
                      className="w-[32px] rounded-t-[4px] bg-[#2563eb]"
                      style={{ height: week.h }}
                    />
                    <p className="text-[12px] text-[#64748b]">{week.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-w-px flex-1 flex-col gap-[16px] rounded-[12px] border border-[#e2e8f0] bg-white p-[24px]">
              <p className="font-[family-name:var(--font-epilogue)] text-[16px] font-bold text-[#1e293b]">
                Harajatlar tarkibi (%)
              </p>
              <div className="flex w-full flex-col gap-[8px]">
                {expenses.map((item) => (
                  <div key={item.label} className="flex w-full flex-col gap-[4px]">
                    <div className="flex w-full items-start justify-between text-[13px] text-[#1e293b]">
                      <p className="font-medium">{item.label}</p>
                      <p className="font-bold">{item.value}%</p>
                    </div>
                    <div className="flex h-[6px] overflow-hidden rounded-[3px] bg-[#f1f5f9]">
                      <div
                        className="h-full"
                        style={{ width: item.width, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-[16px]">
            <p className="font-[family-name:var(--font-epilogue)] text-[18px] font-bold text-[#1e293b]">
              Top sotilgan tovarlar
            </p>
            <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
              <div className="overflow-x-auto">
                <div className="flex min-w-[760px] bg-[#f1f5f9] px-[24px] py-[14px] text-[12px] font-bold text-[#1e293b]">
                  <p className="w-[40px]">#</p>
                  <p className="min-w-[240px] flex-1">Tovar nomi</p>
                  <p className="w-[150px] text-center">Sotilgan soni</p>
                  <p className="w-[180px] text-right">Jami summa</p>
                  <p className="w-[180px] text-right">Sof foyda</p>
                </div>
                {topSold.slice(0, 5).map((row, index) => (
                  <div
                    key={row.name}
                    className="flex min-w-[760px] items-center border-b border-[#e2e8f0] px-[24px] py-[16px] text-[14px]"
                  >
                  <p className="w-[40px] text-[#64748b]">{index + 1}</p>
                  <p className="min-w-[240px] flex-1 font-semibold text-[#1e293b]">{row.name}</p>
                  <p className="w-[150px] text-center">{row.count}</p>
                  <p className="w-[180px] text-right">{formatUzs(row.total)} so&apos;m</p>
                  <p className="w-[180px] text-right font-semibold text-[#15803d]">
                    {formatUzs(row.profit)} so&apos;m
                  </p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Summary({
  label,
  value,
  color = "text-[#1e293b]",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-[8px] rounded-[12px] border border-[#e2e8f0] bg-white p-[20px]">
      <p className="text-[13px] text-[#64748b]">{label}</p>
      <p className={`font-[family-name:var(--font-epilogue)] text-[20px] font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { useStore } from "@/lib/store";
import { formatUzs, netProfit } from "@/lib/format";

export default function DashboardPage() {
  const { state, kpis, productById } = useStore();

  return (
    <AppShell title="Bosh Panel">
      {(search) => {
        const q = search.toLowerCase();
        const recentSales = state.sales.filter((s) => {
          const product = productById(s.productId);
          return (
            !q ||
            s.customer.toLowerCase().includes(q) ||
            product?.name.toLowerCase().includes(q)
          );
        });
        return (
          <div className="page-pad flex flex-col gap-[24px]">
            <div className="kpi-grid">
              <KpiCard
                label="Jami tovarlar"
                value={kpis.totalProducts.toLocaleString("en-US")}
                icon="package-kpi"
                iconBg="#dbeafe"
                trend="+12.5%"
              />
              <KpiCard
                label="Sotilgan"
                value={String(kpis.soldCount)}
                icon="shopping-bag"
                iconBg="#dcfce7"
                trend="+8.2%"
              />
              <KpiCard
                label="Qarzga berilgan"
                value={String(kpis.debtCount)}
                icon="credit-card"
                iconBg="#fee2e2"
                trend="-3.1%"
                trendDown
              />
              <KpiCard
                label="Oylik foyda"
                value={`${formatUzs(kpis.monthlyProfit)} so'm`}
                icon="trending-up"
                iconBg="#ffedd5"
                trend="+18.4%"
              />
            </div>
            <div className="split-2">
              <section className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
                <div className="flex items-center justify-between px-[24px] py-[16px]">
                  <h2 className="font-[family-name:var(--font-epilogue)] text-[16px] font-bold text-[#1e293b]">
                    So&apos;nggi sotuvlar
                  </h2>
                  <Link href="/sales" className="text-[13px] font-semibold text-[#2563eb]">
                    Barchasi
                  </Link>
                </div>
                {recentSales.slice(0, 5).map((sale) => {
                  const product = productById(sale.productId);
                  return (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between border-t border-[#e2e8f0] px-[24px] py-[14px]"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-[#1e293b]">
                          {product?.name}
                        </p>
                        <p className="text-[12px] text-[#64748b]">
                          {sale.customer} · {sale.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-[12px]">
                        <p className="text-[14px] font-semibold text-[#2563eb]">
                          {formatUzs(sale.soldPrice)}
                        </p>
                        <Badge tone={sale.status === "Tasdiqlangan" ? "confirmed" : "cancelled"}>
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </section>
              <section className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
                <div className="flex items-center justify-between px-[24px] py-[16px]">
                  <h2 className="font-[family-name:var(--font-epilogue)] text-[16px] font-bold text-[#1e293b]">
                    Qarzlar holati
                  </h2>
                  <Link href="/debts" className="text-[13px] font-semibold text-[#2563eb]">
                    Barchasi
                  </Link>
                </div>
                {state.debts.slice(0, 5).map((debt) => {
                  const product = productById(debt.productId);
                  return (
                    <div
                      key={debt.id}
                      className="flex items-center justify-between border-t border-[#e2e8f0] px-[24px] py-[14px]"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-[#1e293b]">{debt.debtor}</p>
                        <p className="text-[12px] text-[#64748b]">{product?.name}</p>
                      </div>
                      <p className="text-[14px] font-semibold text-[#b91c1c]">
                        {formatUzs(debt.amount - debt.paid)}
                      </p>
                    </div>
                  );
                })}
              </section>
            </div>
            <section className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
              <div className="flex items-center justify-between px-[24px] py-[16px]">
                <h2 className="font-[family-name:var(--font-epilogue)] text-[16px] font-bold text-[#1e293b]">
                  Tovarlar
                </h2>
                <Link href="/products" className="text-[13px] font-semibold text-[#2563eb]">
                  Tovarlar bo&apos;limi
                </Link>
              </div>
              {state.products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-[16px] border-t border-[#e2e8f0] px-[16px] py-[12px] md:px-[24px]"
                >
                  <img
                    src={product.image}
                    alt=""
                    width={36}
                    height={36}
                    className="size-[36px] rounded-[6px] object-cover"
                  />
                  <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#1e293b]">
                    {product.name}
                  </p>
                  <p className="hidden w-[90px] text-[13px] text-[#64748b] sm:block">
                    {product.brand}
                  </p>
                  <p className="w-[90px] text-right text-[13px] font-semibold text-[#2563eb]">
                    {formatUzs(product.sellUzs)}
                  </p>
                  <p className="hidden w-[90px] text-right text-[13px] font-semibold text-[#15803d] sm:block">
                    {formatUzs(netProfit(product))}
                  </p>
                </div>
              ))}
            </section>
          </div>
        );
      }}
    </AppShell>
  );
}

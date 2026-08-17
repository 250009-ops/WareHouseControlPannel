"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Icon } from "@/components/Icon";
import { ProductModal } from "@/components/products/ProductModal";
import { useStore } from "@/lib/store";
import { chinaUzs, formatUsd, formatUzs, netProfit } from "@/lib/format";
import type { Product } from "@/lib/types";

const PAGE_SIZE = 6;

export default function ProductsPage() {
  const { state, kpis, saveProduct } = useStore();
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Product | null | "new">(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  return (
    <AppShell title="Bosh Panel">
      {(search) => {
        const filtered = state.products.filter((p) => {
          const q = search.toLowerCase();
          const matchesSearch =
            !q ||
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q);
          const matchesStatus = statusFilter === "all" || p.status === statusFilter;
          return matchesSearch && matchesStatus;
        });
        const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        const start = filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0;
        const end = Math.min(page * PAGE_SIZE, filtered.length);

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
            <div className="toolbar-row rounded-[12px] border border-[#e2e8f0] bg-white px-[16px] py-[16px] md:px-[20px] md:py-[20px]">
              <div className="flex flex-wrap items-center gap-[12px]">
                <label className="flex items-center gap-[8px] rounded-[8px] border border-[#e2e8f0] px-[16px] py-[8px] text-[14px] text-[#1e293b]">
                  <Icon name="filter" size={16} alt="" />
                  Filtrlar
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="bg-transparent outline-none"
                  >
                    <option value="all">Barchasi</option>
                    <option value="Sotilgan">Sotilgan</option>
                    <option value="Sotilmagan">Sotilmagan</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setExporting(true);
                    const csv = [
                      ["Nomi", "Brendi", "Razmer", "Rang", "Sotish", "Holati"].join(","),
                      ...filtered.map((p) =>
                        [p.name, p.brand, p.size, p.color, p.sellUzs, p.status].join(","),
                      ),
                    ].join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "tovarlar.csv";
                    a.click();
                    setExporting(false);
                  }}
                  className="flex items-center gap-[8px] rounded-[8px] border border-[#e2e8f0] px-[16px] py-[8px] text-[14px] text-[#1e293b]"
                >
                  <Icon name="download" size={16} alt="" />
                  {exporting ? "Yuklanmoqda..." : "Eksport (Excel)"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setModal("new")}
                className="flex items-center gap-[8px] rounded-[8px] bg-[#2563eb] px-[20px] py-[8px] text-[14px] font-semibold text-white"
              >
                <Icon name="plus" size={16} alt="" />
                + Yangi tovar qo&apos;shish
              </button>
            </div>
            <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="bg-[#f8fafc] text-[12px] font-semibold text-[#64748b]">
                    <tr>
                      {[
                        "#",
                        "Rasm",
                        "Nomi",
                        "Brendi",
                        "Razmer",
                        "Rang",
                        "Xitoy ($)",
                        "Kargo ($)",
                        "Xitoy (so'm)",
                        "Tan narxi",
                        "Sotish",
                        "Sotilgan",
                        "Holati",
                        "Qarz",
                        "Sof foyda",
                      ].map((h) => (
                        <th key={h} className="px-[12px] py-[14px] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((product, index) => {
                      const profit = netProfit(product);
                      return (
                        <tr
                          key={product.id}
                          onClick={() => setModal(product)}
                          className="cursor-pointer border-t border-[#e2e8f0] text-[13px] hover:bg-[#f8fafc]"
                        >
                          <td className="px-[12px] py-[16px] text-[#64748b]">
                            {(page - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="px-[12px] py-[12px]">
                            <img
                              src={product.image}
                              alt=""
                              width={36}
                              height={36}
                              className="size-[36px] rounded-[6px] object-cover"
                            />
                          </td>
                          <td className="px-[12px] py-[16px] font-semibold text-[#1e293b]">
                            {product.name}
                          </td>
                          <td className="px-[12px] py-[16px] text-[#64748b]">{product.brand}</td>
                          <td className="px-[12px] py-[16px]">{product.size}</td>
                          <td className="px-[12px] py-[16px]">{product.color}</td>
                          <td className="px-[12px] py-[16px]">{formatUsd(product.chinaUsd)}</td>
                          <td className="px-[12px] py-[16px]">{formatUsd(product.cargoUsd)}</td>
                          <td className="px-[12px] py-[16px]">
                            {formatUzs(chinaUzs(product.chinaUsd, state.settings.usdRate))}
                          </td>
                          <td className="px-[12px] py-[16px]">{formatUzs(product.costUzs)}</td>
                          <td className="px-[12px] py-[16px] font-semibold text-[#2563eb]">
                            {formatUzs(product.sellUzs)}
                          </td>
                          <td className="px-[12px] py-[16px]">{formatUzs(product.soldUzs)}</td>
                          <td className="px-[12px] py-[16px]">
                            <Badge tone={product.status === "Sotilgan" ? "sold" : "unsold"}>
                              {product.status}
                            </Badge>
                          </td>
                          <td className="px-[12px] py-[16px]">
                            <Badge tone={product.debt === "To'langan" ? "paid" : "unpaid"}>
                              {product.debt}
                            </Badge>
                          </td>
                          <td className="px-[12px] py-[16px] font-semibold text-[#15803d]">
                            {formatUzs(profit)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                label={`Jami ${filtered.length} ta tovardan ${start}-${end} ko'rsatilmoqda`}
                page={page}
                pages={pages}
                onPage={setPage}
              />
            </div>
            {modal !== null ? (
              <ProductModal
                product={modal === "new" ? null : modal}
                rate={state.settings.usdRate}
                onClose={() => setModal(null)}
                onSave={async (product) => {
                  await saveProduct(product);
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

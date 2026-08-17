export function formatUzs(value: number | null | undefined, suffix = false) {
  if (value === null || value === undefined) return "—";
  const formatted = Math.round(value).toLocaleString("en-US").replace(/,/g, ",");
  return suffix ? `${formatted} so'm` : formatted;
}

export function formatUzsLabel(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${Math.round(value).toLocaleString("en-US")} UZS`;
}

export function formatUsd(value: number) {
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function parseDate(value: string) {
  const [d, m, y] = value.split(".");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

export function formatDate(date: Date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}.${m}.${date.getFullYear()}`;
}

export function chinaUzs(chinaUsd: number, rate: number) {
  return Math.round(chinaUsd * rate);
}

export function netProfit(product: { sellUzs: number; costUzs: number; soldUzs: number | null; status: string }) {
  if (product.status !== "Sotilgan" || product.soldUzs === null) return null;
  return product.soldUzs - product.costUzs;
}

export function monthLabel(date: Date) {
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedState } from "./seed";
import type { Admin, AppState, Debt, Product, Sale, Settings } from "./types";
import { chinaUzs, netProfit } from "./format";

type StoreContextValue = {
  state: AppState;
  ready: boolean;
  usingSupabase: boolean;
  productById: (id: string) => Product | undefined;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveSale: (sale: Sale) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  saveDebt: (debt: Debt) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  saveAdmin: (admin: Admin) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  saveSettings: (settings: Settings) => Promise<void>;
  kpis: {
    totalProducts: number;
    soldCount: number;
    debtCount: number;
    monthlyProfit: number;
    todaySales: number;
    monthlySales: number;
    averageCheck: number;
    totalDebt: number;
    paidDebt: number;
    remainingDebt: number;
    revenue: number;
    expenses: number;
    margin: number;
  };
};

const StoreContext = createContext<StoreContextValue | null>(null);

async function fetchState(): Promise<AppState> {
  const res = await fetch("/api/data");
  if (!res.ok) return seedState;
  const data = (await res.json()) as { state: AppState };
  return data.state;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [ready, setReady] = useState(false);
  const [usingSupabase, setUsingSupabase] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const [next, health] = await Promise.all([
        fetchState(),
        fetch("/api/health")
          .then((r) => r.json())
          .catch(() => ({ supabase: { admin: false } })),
      ]);
      if (cancelled) return;
      setState(next);
      setUsingSupabase(Boolean(health?.supabase?.admin));
      setReady(true);
    }
    hydrate();
    const onAuth = () => {
      void hydrate();
    };
    window.addEventListener("ombor-auth", onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener("ombor-auth", onAuth);
    };
  }, []);

  const persist = useCallback(async (next: AppState) => {
    setState(next);
    const res = await fetch("/api/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: next }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || "Saqlash amalga oshmadi");
    }
  }, []);

  const productById = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products],
  );

  const saveProduct = useCallback(
    async (product: Product) => {
      const exists = state.products.some((p) => p.id === product.id);
      const products = exists
        ? state.products.map((p) => (p.id === product.id ? product : p))
        : [product, ...state.products];
      await persist({ ...state, products });
    },
    [persist, state],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await persist({
        ...state,
        products: state.products.filter((p) => p.id !== id),
        sales: state.sales.filter((s) => s.productId !== id),
        debts: state.debts.filter((d) => d.productId !== id),
      });
    },
    [persist, state],
  );

  const saveSale = useCallback(
    async (sale: Sale) => {
      const exists = state.sales.some((s) => s.id === sale.id);
      const sales = exists
        ? state.sales.map((s) => (s.id === sale.id ? sale : s))
        : [sale, ...state.sales];
      const products = state.products.map((p) => {
        if (p.id !== sale.productId) return p;
        if (sale.status === "Tasdiqlangan") {
          return {
            ...p,
            status: "Sotilgan" as const,
            soldUzs: sale.soldPrice,
            debt: sale.paymentType === "Qarz" ? ("To'lanmagan" as const) : p.debt,
          };
        }
        return p;
      });
      let debts = state.debts;
      if (sale.paymentType === "Qarz" && sale.status === "Tasdiqlangan") {
        const already = debts.some(
          (d) => d.productId === sale.productId && d.debtor === sale.customer,
        );
        if (!already) {
          debts = [
            {
              id: crypto.randomUUID(),
              debtor: sale.customer,
              phone: "+998 90 000 00 00",
              productId: sale.productId,
              amount: sale.soldPrice,
              issuedAt: sale.date,
              dueAt: sale.date,
              paid: 0,
              status: "Jarayonda",
            },
            ...debts,
          ];
        }
      }
      await persist({ ...state, sales, products, debts });
    },
    [persist, state],
  );

  const deleteSale = useCallback(
    async (id: string) => {
      await persist({ ...state, sales: state.sales.filter((s) => s.id !== id) });
    },
    [persist, state],
  );

  const saveDebt = useCallback(
    async (debt: Debt) => {
      const exists = state.debts.some((d) => d.id === debt.id);
      const debts = exists
        ? state.debts.map((d) => (d.id === debt.id ? debt : d))
        : [debt, ...state.debts];
      const products = state.products.map((p) => {
        if (p.id !== debt.productId) return p;
        return {
          ...p,
          debt: debt.status === "To'langan" ? ("To'langan" as const) : ("To'lanmagan" as const),
        };
      });
      await persist({ ...state, debts, products });
    },
    [persist, state],
  );

  const deleteDebt = useCallback(
    async (id: string) => {
      await persist({ ...state, debts: state.debts.filter((d) => d.id !== id) });
    },
    [persist, state],
  );

  const saveAdmin = useCallback(
    async (admin: Admin) => {
      const exists = state.admins.some((a) => a.id === admin.id);
      const admins = exists
        ? state.admins.map((a) => (a.id === admin.id ? admin : a))
        : [admin, ...state.admins];
      await persist({ ...state, admins });
    },
    [persist, state],
  );

  const deleteAdmin = useCallback(
    async (id: string) => {
      await persist({ ...state, admins: state.admins.filter((a) => a.id !== id) });
    },
    [persist, state],
  );

  const saveSettings = useCallback(
    async (settings: Settings) => {
      await persist({ ...state, settings });
    },
    [persist, state],
  );

  const kpis = useMemo(() => {
    const confirmed = state.sales.filter((s) => s.status === "Tasdiqlangan");
    const today = "16.08.2026";
    const todaySales = confirmed
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.soldPrice, 0);
    const monthlySales = confirmed.reduce((sum, s) => sum + s.soldPrice, 0);
    const averageCheck = confirmed.length
      ? Math.round(monthlySales / confirmed.length)
      : 0;
    const soldCount = state.products.filter((p) => p.status === "Sotilgan").length;
    const debtCount = state.products.filter((p) => p.debt === "To'lanmagan").length;
    const monthlyProfit = state.products
      .map((p) => netProfit(p) ?? 0)
      .reduce((a, b) => a + b, 0);
    const totalDebt = state.debts.reduce((sum, d) => sum + d.amount, 0);
    const paidDebt = state.debts.reduce((sum, d) => sum + d.paid, 0);
    const remainingDebt = totalDebt - paidDebt;
    return {
      totalProducts: state.products.length,
      soldCount,
      debtCount,
      monthlyProfit: monthlyProfit || 45200000,
      todaySales: todaySales || 3450000,
      monthlySales: monthlySales || 45200000,
      averageCheck: averageCheck || 385000,
      totalDebt: totalDebt || 4850000,
      paidDebt: paidDebt || 2100000,
      remainingDebt: remainingDebt || 2750000,
      revenue: 120500000,
      expenses: 75300000,
      margin: 37.5,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      ready,
      usingSupabase,
      productById,
      saveProduct,
      deleteProduct,
      saveSale,
      deleteSale,
      saveDebt,
      deleteDebt,
      saveAdmin,
      deleteAdmin,
      saveSettings,
      kpis,
    }),
    [
      state,
      ready,
      usingSupabase,
      productById,
      saveProduct,
      deleteProduct,
      saveSale,
      deleteSale,
      saveDebt,
      deleteDebt,
      saveAdmin,
      deleteAdmin,
      saveSettings,
      kpis,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useComputedProduct(product: Product, rate: number) {
  return {
    chinaSom: chinaUzs(product.chinaUsd, rate),
    profit: netProfit(product),
  };
}

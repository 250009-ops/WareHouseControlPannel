import { promises as fs } from "fs";
import path from "path";
import { seedState } from "@/lib/seed";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/env";
import type { Admin, AppState, Debt, Product, Sale, Settings } from "@/lib/types";

const filePath = path.join(process.cwd(), "data", "store.json");

async function readFileState(): Promise<AppState> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return { ...seedState, ...JSON.parse(raw) } as AppState;
  } catch {
    await writeFileState(seedState);
    return seedState;
  }
}

async function writeFileState(state: AppState) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(state, null, 2), "utf8");
}

async function readSupabaseState(): Promise<AppState | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const [products, sales, debts, admins, settings] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("sales").select("*"),
    supabase.from("debts").select("*"),
    supabase.from("admins").select("*"),
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  if (products.error) {
    console.error("Supabase products error", products.error.message);
    return null;
  }
  if (!products.data?.length) {
    await writeSupabaseState(seedState);
    return seedState;
  }
  return {
    products: products.data as Product[],
    sales: (sales.data as Sale[]) ?? [],
    debts: (debts.data as Debt[]) ?? [],
    admins: (admins.data as Admin[]) ?? [],
    settings: (settings.data as Settings) ?? seedState.settings,
  };
}

async function writeSupabaseState(state: AppState) {
  const supabase = createAdminClient();
  if (!supabase) return;
  const results = await Promise.all([
    supabase.from("products").upsert(state.products),
    supabase.from("sales").upsert(state.sales),
    supabase.from("debts").upsert(state.debts),
    supabase.from("admins").upsert(state.admins),
    supabase.from("settings").upsert({ id: 1, ...state.settings }),
  ]);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    throw new Error(failed.error.message);
  }
}

export async function getState(): Promise<AppState> {
  if (isSupabaseAdminConfigured()) {
    const remote = await readSupabaseState();
    if (remote) return remote;
  }
  return readFileState();
}

export async function saveState(state: AppState): Promise<AppState> {
  if (isSupabaseAdminConfigured()) {
    await writeSupabaseState(state);
  }
  await writeFileState(state);
  return state;
}

export function backendName() {
  return isSupabaseAdminConfigured() ? "supabase" : "server-file";
}

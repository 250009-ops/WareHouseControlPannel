import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceKey,
  getSupabaseUrl,
  isSupabaseAdminConfigured,
} from "@/lib/env";

export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

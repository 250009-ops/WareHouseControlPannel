import { NextResponse } from "next/server";
import { backendName } from "@/lib/server/db";
import {
  getAppUrl,
  getPanelEmail,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    appUrl: getAppUrl(),
    panelEmail: getPanelEmail(),
    backend: backendName(),
    supabase: {
      public: isSupabaseConfigured(),
      admin: isSupabaseAdminConfigured(),
    },
  });
}

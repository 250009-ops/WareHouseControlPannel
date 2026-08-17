import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  getPanelEmail,
  getPanelPassword,
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/env";
import { createSession } from "@/lib/server/session";
import { getState } from "@/lib/server/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    remember?: boolean;
  };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const remember = Boolean(body.remember);

  if (isSupabaseConfigured()) {
    const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
  } else if (email !== getPanelEmail().toLowerCase() || password !== getPanelPassword()) {
    return NextResponse.json(
      { error: "Elektron pochta yoki parol noto'g'ri" },
      { status: 401 },
    );
  }

  const state = await getState();
  const user = {
    email,
    name: `${state.settings.firstName} ${state.settings.lastName}`,
    role: state.settings.role,
    avatar: state.settings.avatar,
  };
  await createSession(user, remember);
  return NextResponse.json({ user });
}

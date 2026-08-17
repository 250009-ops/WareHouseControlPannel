import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/server/db";
import { readSession } from "@/lib/server/session";
import type { AppState } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const state = await getState();
  return NextResponse.json({ state });
}

export async function PUT(request: Request) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { state?: AppState };
  if (!body.state) {
    return NextResponse.json({ error: "Missing state" }, { status: 400 });
  }
  const state = await saveState(body.state);
  return NextResponse.json({ state });
}

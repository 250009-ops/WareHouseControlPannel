import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAuthSecret } from "@/lib/env";
import type { SessionUser } from "@/lib/types";

const COOKIE = "ombor_session";

type TokenPayload = SessionUser & { exp: number };

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function encode(payload: TokenPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): TokenPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as TokenPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser, remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12;
  const token = encode({ ...user, exp: Date.now() + maxAge * 1000 });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const payload = decode(token);
  if (!payload) return null;
  const { exp: _exp, ...user } = payload;
  return user;
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  return decode(token);
}

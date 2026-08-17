import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/products",
  "/sales",
  "/debts",
  "/reports",
  "/settings",
  "/admins",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const session = request.cookies.get("ombor_session")?.value;

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico|api/health).*)"],
};

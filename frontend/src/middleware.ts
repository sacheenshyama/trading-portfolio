import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/sign-in" || path === "/sign-up" || path === "/home";
  const token = request.cookies.get("jwtToken")?.value;
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/portfolio", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/portfolio"],
};

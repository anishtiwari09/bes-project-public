import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VISITOR_COOKIE = "besSessionCookies";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  /* ---------------------------------------------
     1️⃣ Ignore prefetch requests
  --------------------------------------------- */
  if (request.headers.get("purpose") === "prefetch") {
    return response;
  }

  /* ---------------------------------------------
     2️⃣ Bot detection
  --------------------------------------------- */
  const ua = request.headers.get("user-agent")?.toLowerCase() || "";
  const isBot =
    ua.includes("bot") ||
    ua.includes("crawler") ||
    ua.includes("spider") ||
    ua.includes("google") ||
    ua.includes("bing") ||
    ua.includes("yandex") ||
    ua.includes("duckduckbot") ||
    ua.includes("baidu") ||
    ua.includes("facebookexternalhit");

  if (isBot) {
    return response;
  }

  /* ---------------------------------------------
     3️⃣ Cookie guard (IMPORTANT)
     If cookie exists → DO NOTHING
  --------------------------------------------- */
  const hasVisited = request.cookies.get(VISITOR_COOKIE);

  if (hasVisited) {
    return response;
  }

  /* ---------------------------------------------
     4️⃣ Fire tracking ONLY ONCE
  --------------------------------------------- */
  try {
    const origin = request.nextUrl.origin;

    await fetch(`${origin}/backend/api/track-visitor`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.INTERNAL_SECRET!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        path: request.nextUrl.pathname,
        ts: Date.now(),
      }),
    });
  } catch {
    // never block request
  }

  /* ---------------------------------------------
     5️⃣ Set cookie to prevent future calls
  --------------------------------------------- */
  response.cookies.set(VISITOR_COOKIE, Date.now().toString(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

/* ---------------------------------------------
   6️⃣ Apply only to real pages
--------------------------------------------- */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|backend/api|.*\\.(?:pdf|png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|eot|txt|xml|zip|rar|mp4|mp3)).*)",
  ],
};

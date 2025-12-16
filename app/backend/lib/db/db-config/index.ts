import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VISITOR_COOKIE = "besSessionCookies";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  /* =====================================================
     STEP 1: Filter Out Non-Real Users
  ===================================================== */

  // 1a. Skip prefetch requests (Next.js optimization)
  if (request.headers.get("purpose") === "prefetch") {
    return response;
  }

  // 1b. Skip Next.js internal requests
  if (request.headers.get("x-middleware-prefetch")) {
    return response;
  }

  // 1c. Comprehensive bot detection
  const ua = request.headers.get("user-agent")?.toLowerCase() || "";

  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "slackbot",
    "telegrambot",
    "discordbot",
    "headless",
    "phantom",
    "selenium",
    "webdriver",
    "curl",
    "wget",
    "python-requests",
    "go-http-client",
    "java/",
    "apache-httpclient",
    "okhttp",
  ];

  if (botPatterns.some((pattern) => ua.includes(pattern))) {
    return response;
  }

  // 1d. Detect headless browsers (common in scrapers)
  if (!ua || ua === "mozilla/5.0") {
    return response;
  }

  /* =====================================================
     STEP 2: Check if Already Tracked (ONE TIME ONLY)
  ===================================================== */

  const existingCookie = request.cookies.get(VISITOR_COOKIE);

  if (existingCookie) {
    // User already tracked - do nothing
    return response;
  }

  /* =====================================================
     STEP 3: New Real User Detected - Track NOW
  ===================================================== */

  // Set cookie FIRST (prevents race conditions)
  const timestamp = Date.now();
  response.cookies.set(VISITOR_COOKIE, timestamp.toString(), {
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: true, // HTTPS only (always true on Vercel)
    sameSite: "lax", // CSRF protection
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/", // Available site-wide
  });

  /* =====================================================
     STEP 4: Fire Tracking Request (Secure)
  ===================================================== */

  try {
    // Await the fetch to ensure it completes (Vercel Edge Runtime requirement)
    console.log("started calling", request.nextUrl.origin);
    await fetch(`${request.nextUrl.origin}/backend/api/track-visitor`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.INTERNAL_SECRET!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // Landing page
        path: request.nextUrl.pathname,

        // Traffic source
        referrer: request.headers.get("referer") || "direct",

        // Timestamp
        timestamp: timestamp,

        // Optional: Add more context
        userAgent: request.headers.get("user-agent"),
        country: (request as any)?.geo?.country || "unknown",
        city: (request as any).geo?.city || "unknown",
      }),
    });
    console.log("tracking done", request.nextUrl.origin);
  } catch (error) {
    // Never block user experience on tracking failure
    console.error("Tracking failed:", error);
  }

  return response;
}

/* =====================================================
   STEP 5: Apply Only to Real Pages
===================================================== */

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, etc.
     * - API routes
     * - File extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|.*\\.(?:pdf|png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|eot|txt|xml|json)).*)",
  ],
};

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JSESSIONID } from "./app/backend/constant";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// import { updateVisitorCounter } from "./app/backend/helper/visitor_helper/visitor_counter_helper";
export async function middleware(request: any) {
  const cookieStore = await cookies();
  let besSessionCookies = cookieStore.get("besSessionCookies");
  let response = NextResponse.next();
  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years in seconds
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const, // ✅ Fix TypeScript error
  };
  response.cookies.delete("updateCounter");
  if (!besSessionCookies) {
    response.cookies.set(
      "besSessionCookies",
      Date.now().toString(),
      cookieOptions
    );
    response.cookies.set("updateCounter", "true", cookieOptions);
    // updateVisitorCounter();
    // cookieStore.set("besSessionCookies", Date.now());
  }
  let pathname = request.nextUrl.pathname;
  if (request.nextUrl.pathname.startsWith("/user/signout")) {
    return handleSignOut(request);
  }
  if (isProtectedRoute(pathname)) {
    if (!isLogin(cookieStore)) return handleHomePageRedirect(request);
  }
  if (
    isLogin(cookieStore) &&
    pathname.startsWith("/error_page/invalid_token")
  ) {
    return handleHomePageRedirect(request);
  }
  return response;
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!backend/api/|_next/static|_next/image|favicon.ico|Images/).*)",
  ],
};

function handleSignOut(request: Request) {
  let response = handleHomePageRedirect(request);
  response.cookies.delete(JSESSIONID);
  return response;
}
function isLogin(cookies: ReadonlyRequestCookies) {
  let token = cookies.get(JSESSIONID)?.value;

  return !!token;
}
function isProtectedRoute(pathname: string) {
  pathname = pathname || "";
  for (let item of protectedRoute) {
    if (pathname.startsWith(item)) return true;
  }
  return false;
}

function handleHomePageRedirect(request: Request) {
  return NextResponse.redirect(new URL("/", request.url));
}
const protectedRoute = ["/user/"];

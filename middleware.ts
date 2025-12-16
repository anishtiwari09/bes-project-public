import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JSESSIONID } from "./app/backend/constant";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// import { updateVisitorCounter } from "./app/backend/helper/visitor_helper/visitor_counter_helper";
export async function middleware(request: any) {
  let response = NextResponse.next();

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

  return false;
}

function handleHomePageRedirect(request: Request) {
  return NextResponse.redirect(new URL("/", request.url));
}
const protectedRoute = ["/user/"];

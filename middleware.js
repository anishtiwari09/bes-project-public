import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JSESSIONID } from "./app/backend/constant";

// import { updateVisitorCounter } from "./app/backend/helper/visitor_helper/visitor_counter_helper";
export async function middleware(request) {
  const cookieStore = cookies();
  let besSessionCookies = cookieStore.get("besSessionCookies");
  let response = NextResponse.next();
  if (!besSessionCookies) {
    response.cookies.set("besSessionCookies", Date.now());
    // updateVisitorCounter();
    // cookieStore.set("besSessionCookies", Date.now());
  }
  // console.log({ request });
  if (request.nextUrl.pathname.startsWith("/user")) {
    return userMiddleware(request);
  }
  console.log({ pathanme: request.nextUrl.pathname });

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
    "/((?!api|_next/static|_next/image|favicon.ico|Images/).*)",
  ],
};

function userMiddleware(request) {
  console.log({ pathanme: request.nextUrl.pathname });
  let pathName = request.nextUrl.pathname;
  if (pathName.includes("/signout")) {
    let response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(JSESSIONID);
    return response;
  }
  return request;
}

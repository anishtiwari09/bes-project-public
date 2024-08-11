"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  return response;
}

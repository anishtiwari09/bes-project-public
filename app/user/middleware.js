"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// import { updateVisitorCounter } from "./app/backend/helper/visitor_helper/visitor_counter_helper";
export async function middleware(request) {
  return request;
}

import React from "react";
import PersonalInformation from "./component/personalInformation";
import { getUserDetails } from "@/app/backend/action/action";
import { JSESSIONID } from "@/app/backend/constant";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export default async function page() {
  let token:RequestCookie|string |undefined= cookies().get(JSESSIONID);
  token = token?.value || "";
  const data = await getUserDetails(token);
  if (!data) return <h3>Something went wrong please try again...</h3>;
  return <PersonalInformation {...data} />;
}

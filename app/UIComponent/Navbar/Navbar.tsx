import React from "react";
import Header1 from "./Header1";
import Header2 from "./Header2";
import { cookies } from "next/headers";
import { JSESSIONID } from "@/app/backend/constant";
import { decodeJsonToken, verifyJsonToken } from "@/app/helper/helper";
import UserProfile from "../UserProfile/UserProfile";
import { getUserName } from "@/app/backend/action/action";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import LoginButton from "../LoginButton/LoginButton";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

export default async function Navbar() {
  const cookieStore = await cookies();
  let token: RequestCookie | string | undefined = cookieStore.get(JSESSIONID);
  token = token?.value || "";
  let isValid = false;
  if (token) {
    try {
      const jswonService = new JwtTokenService();
      let valid = await jswonService.verifyToken(token);
      isValid = valid;
    } catch (e) {
      console.log(e);
    }
  }
  let userName = "";
  let deleteCookies = false;
  if (isValid) {
    userName = await getUserName(token);

    if (!userName) {
      isValid = false;
      deleteCookies = true;
    }
  }
  return (
    <div className="flex flex-row gap-1 items-stretch bg-[#101130]">
      <Header1 />
      <div className="flex flex-col items-end justify-end flex-1">
        <UserProfile
          isSignIn={isValid}
          deleteCookies={deleteCookies}
          userName={userName}
        />
        <Header2 />
      </div>
      {isValid ? null : (
        <div className="absolute right-1 top-1 text-white">
          <LoginButton />
        </div>
      )}
    </div>
  );
}

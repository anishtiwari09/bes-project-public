import React from "react";
import Header1 from "./Header1";
import Header2 from "./Header2";
import LoginButton from "../LoginButton/LoginButton";
import { cookies } from "next/headers";
import { JSESSIONID } from "@/app/backend/constant";
import { verifyJsonToken } from "@/app/helper/helper";

export default function Navbar() {
  let token = cookies().get(JSESSIONID);
  token = token.value;
  let isValid = false;
  try {
    let valid = verifyJsonToken(token);
    isValid = valid;
  } catch (e) {
    console.log(e);
  }
  return (
    <div className="flex flex-row gap-1 items-end bg-[#101130] ">
      <Header1 />
      <Header2 />
      {isValid ? null : (
        <div className="absolute right-1 top-1 text-white">
          <LoginButton />
        </div>
      )}
    </div>
  );
}

"use client";
import React from "react";
import Header1 from "./Header1";
import Header2 from "./Header2";
import UserProfile from "../UserProfile/UserProfile";
import LoginButton from "../LoginButton/LoginButton";
import { useAuthContext } from "../context-provider/auth-provider";

export default function Navbar() {
  const { userData } = useAuthContext();
  return (
    <div className="flex flex-row gap-1 items-stretch bg-[#101130]">
      <Header1 />
      <div className="flex flex-col items-end justify-end flex-1">
        <UserProfile
          isSignIn={!!userData}
          deleteCookies={""}
          userName={userData?.name}
        />
        <Header2 />
      </div>
      {!!userData ? null : (
        <div className="absolute right-1 top-1 text-white">
          <LoginButton />
        </div>
      )}
    </div>
  );
}

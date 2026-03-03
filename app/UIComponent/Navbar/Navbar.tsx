"use client";
import React, { Suspense } from "react";
import Header1 from "./Header1";
import Header2 from "./Header2";
import UserProfile from "../UserProfile/UserProfile";
import LoginButton from "../LoginButton/LoginButton";
import { useAuthContext } from "../context-provider/auth-provider";

export default function Navbar() {
  const { userData, isSignIn } = useAuthContext();

  return (
    <div className="flex flex-row gap-1 items-stretch bg-[#101130]">
      <Header1 />
      <div className="flex flex-col items-end justify-end flex-1">
        {isSignIn && (
          <UserProfile userName={userData?.name} role={userData?.role} />
        )}

        <div className="mr-6 md:mr-0 flex items-center">
          <Header2 />
        </div>
      </div>
      {!!userData ? null : (
        <div className="absolute right-1 top-1 text-white">
          <Suspense>
            <LoginButton />
          </Suspense>
        </div>
      )}
    </div>
  );
}

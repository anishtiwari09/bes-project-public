import React from "react";
import Header1 from "./Header1";
import Header2 from "./Header2";
import LoginButton from "../LoginButton/LoginButton";

export default function Navbar() {
  return (
    <div className="flex flex-row gap-1 items-end bg-[#101130] ">
      <Header1 />
      <Header2 />
      <div className="absolute right-1 top-1 text-white">
        <LoginButton />
      </div>
    </div>
  );
}

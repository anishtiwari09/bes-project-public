import React from "react";
import Enquiry from "../bes_expo/Enquiry/Enquiry";
import SideNav from "./SideNav/SideNav";

export default function layout({
  children
}: any) {
  return (
    <div
      className="flex gap-[10px] p-4 bg-[#f2f2f2] flex-1 justify-between min-h-full"
      style={{
        backgroundImage: "url(https://www.besindia.co.in/images/BG_page.png)",
      }}
    >
      <div className="min-w-[230px]">
        <SideNav />
      </div>
      <div>
        {children}
        <br />
        <br />
        <Enquiry />
      </div>
      <div></div>
    </div>
  );
}

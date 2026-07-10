import React from "react";
import Enquiry from "../bes_expo/Enquiry/Enquiry";
import SideNav from "./SideNav/SideNav";
import MobileBottomNavWrapper from "@/app/UIComponent/MobileBottomNavWrapper";

export default function layout({ children }: any) {
  return (
    <div
      className="flex flex-col md:flex-row gap-[10px] p-4 pl-14 md:pl-4 pb-20 md:pb-4 bg-[#f2f2f2] flex-1 justify-between relative"
      style={{
        backgroundImage: "url(https://www.besindia.co.in/images/BG_page.png)",
      }}
    >
      <div className="min-w-[230px] hidden md:block">
        <SideNav />
      </div>
      <div>
        {children}
        <br />
        <br />
        <Enquiry />
      </div>
      <div className="hidden md:block"></div>

      <MobileBottomNavWrapper title="Other Events">
        <div className="rounded-xl overflow-hidden shadow-sm border border-orange-100">
          <SideNav />
        </div>
      </MobileBottomNavWrapper>
    </div>
  );
}

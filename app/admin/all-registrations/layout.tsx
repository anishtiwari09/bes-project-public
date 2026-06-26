import React from "react";
import SideNav from "./sideNav";
import MobileBottomNavWrapper from "@/app/UIComponent/MobileBottomNavWrapper";

export default function layout({ children }: any) {
  return (
    <div
      className="flex flex-col md:flex-row gap-[10px] p-4 pl-14 md:pl-4 pb-20 md:pb-4 bg-[#f2f2f2] flex-1 justify-between min-h-full relative"
      style={{
        backgroundImage: "url(https://www.besindia.co.in/images/BG_page.png)",
      }}
    >
      <div className="min-w-[230px] hidden md:block">
        <SideNav />
      </div>
      <div className="w-full max-w-full overflow-hidden md:overflow-visible md:flex-1">
        {children}
      </div>
      <div className="hidden md:block"></div>

      <MobileBottomNavWrapper title="Registrations">
        <div className="rounded-xl overflow-hidden shadow-sm border border-orange-100">
          <SideNav />
        </div>
      </MobileBottomNavWrapper>
    </div>
  );
}

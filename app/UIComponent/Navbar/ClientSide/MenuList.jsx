"use client";
import React, { useState, useMemo, useEffect } from "react";
import MenuCompoenent from "./MenuComponent";
import { isMobile } from "../../../Utility/device";
import MobileMenuList from "./MobileMenu/MobileMenuList";

export default function MenuList({ data }) {
  const [showNavbar, setShowNavbar] = useState(false);
  let isMobileTest = useMemo(() => {
    if (typeof window === "object") return isMobile(window);
  }, []);
  const [open, setOpen] = useState(-1);
  useEffect(() => {
    setShowNavbar(true);
  }, []);
  if (!showNavbar) return null;
  return isMobileTest === undefined ? (
    <div></div>
  ) : isMobileTest ? (
    <MobileMenuList data={data} />
  ) : (
    <div className="flex justify-end">
      {data?.map((item, key) =>
        item?.isActive ? (
          <MenuCompoenent
            key={item.id}
            data={item}
            open={key === open}
            setOpen={setOpen}
            index={key}
          />
        ) : null
      )}
    </div>
  );
}

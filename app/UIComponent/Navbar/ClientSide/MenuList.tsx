"use client";

import React, { useState } from "react";
import MenuCompoenent from "./MenuComponent";
import MobileMenuList from "./MobileMenu/MobileMenuList";

export default function MenuList({ data }: any) {
  const [open, setOpen] = useState(-1);

  return (
    <>
      {/* Mobile + Tablet */}
      <div className="block lg:hidden">
        <MobileMenuList data={data} />
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex justify-end">
        {data?.map((item: any, key: number) =>
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
    </>
  );
}

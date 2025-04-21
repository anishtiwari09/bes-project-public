import React from "react";
import db from "../../UIComponent/Navbar/Utility/menudb.json";
import findObject from "../../Utility/findObject";
import SideNavMap from "./SideNavMap";
import styles from "./side.module.css";

export default function SideNav() {
  let aboutUs = findObject("key", db, 1);
  return (
    <div
      className={"bg-[#faac1d] text-white p-4 sticky top-4 " + styles.sideNav}
    >
      <h3 className="font-bold text-[24px] text-black">{aboutUs.name}</h3>
      <SideNavMap db={aboutUs?.subChildren || []} parentPath={aboutUs.path} />
    </div>
  );
}

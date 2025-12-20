import React from "react";

import styles from "./side.module.css";
import SideNavMap from "./side-nav-map";
interface Props {
  db: Record<string, any>[];
  parentPath: string;
  name?: string;
}
export default function MainSideNav(props: Props) {
  return (
    <div
      className={"bg-[#faac1d] text-white p-4 sticky top-4 " + styles.sideNav}
    >
      {!!props?.name && (
        <h3 className="font-bold text-[24px] text-black">{props?.name}</h3>
      )}
      <SideNavMap {...props} />
    </div>
  );
}

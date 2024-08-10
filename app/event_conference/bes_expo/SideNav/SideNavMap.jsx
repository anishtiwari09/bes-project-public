"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "../../../about_bes/SideNav/side.module.css";
import { handleGetDynamicLink } from "@/app/Utility/helper/helper";

export default function SideNavMap({ db, parentPath }) {
  const pathname = usePathname();

  return (
    <ul className="pl-2">
      {db.map((item, key) => {
        item.path = handleGetDynamicLink(item.id) ?? item?.path;
        let temp = item?.isSeprateParentPath ? item.parentPath : parentPath;
        return (
          <li key={item.id}>
            {item?.isSeprateParentPath ? (
              <a
                href={temp + item.path}
                target={`${item?.path.endsWith(".pdf") ? "_blank" : "_self"}`}
                className={`${
                  pathname.endsWith(temp + item.path) ? styles.selected : ""
                }`}
              >
                {" "}
                {item.name}
              </a>
            ) : (
              <Link
                href={temp + item.path}
                target={`${item?.path.endsWith(".pdf") ? "_blank" : "_self"}`}
                className={`${
                  pathname.endsWith(temp + item.path) ? styles.selected : ""
                }`}
              >
                {item.name}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

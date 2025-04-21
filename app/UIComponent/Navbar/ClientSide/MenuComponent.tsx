import { Button, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function MenuCompoenent({
  data,
  index,
  open,
  setOpen
}: any) {
  const timerRef = useRef<NodeJS.Timeout>(undefined);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(-1);
  };
  const handleClick = (e: any) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setOpen(index);
  };
  const pathName = usePathname();

  const handleMouseMovement = (e: any) => {
    if (e.target.className?.includes("MuiBackdrop-invisible")) handleClose();
  };
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);
  return <>
    <div className="flex items-end">
      <Button
        aria-controls={"basic-menu"}
        onMouseEnter={handleClick}
        className="text-white"
        style={{
          color: "white",
          position: "relative",
          zIndex: 1301,
        }}
      >
        {data?.isLink ? (
          data?.normalLink ? (
            <a
              className={`header2_menu_list ${
                open
                  ? "header2_menu_list_open"
                  : pathName.startsWith(data.path) && data.path
                  ? "header2_menu_list_open"
                  : ""
              }`}
              href={data?.path}
            >
              {data?.name}
            </a>
          ) : (
            <Link
              className={`header2_menu_list ${
                open
                  ? "header2_menu_list_open"
                  : pathName.startsWith(data.path) && data.path
                  ? "header2_menu_list_open"
                  : ""
              }`}
              href={data?.path}
            >
              {data?.name}
            </Link>
          )
        ) : (
          <a
            className={`header2_menu_list ${
              open
                ? "header2_menu_list_open"
                : pathName.startsWith(data.path) && data.path
                ? "header2_menu_list_open"
                : ""
            }`}
          >
            {data?.name}
          </a>
        )}
      </Button>
      {data?.isExpandable && data?.subChildren.length ? (
        <Menu
          open={open}
          anchorEl={anchorEl}
          onMouseMove={handleMouseMovement}
          onClose={handleClose}
          className="menu_drop"
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          id="menu_drop"
        >
          {data.subChildren.map((item: any, key: any) => {
            let parentPath = item?.isSeprateParentPath
              ? item?.parentPath
              : data.path;
            if (!item?.isActive) return false;
            return item?.isExpandable && item?.subChildren.length ? (
              <div key={key}>
                <h3 className="font-bold" style={{ padding: "6px 16px" }}>
                  {item?.name}
                </h3>
                <ul className="flex-col gap-1 flex">
                  {item.subChildren?.map((sub_item: any, sub_key: any) => {
                    let newPath = sub_item?.isSeprateParentPath
                      ? sub_item?.parentPath
                      : parentPath + item.path;
                    if (!sub_item?.isActive) return null;
                    return (
                      <li key={sub_item.id}>
                        <MenuItem
                          onClick={handleClose}
                          style={{ padding: "6px 30px" }}
                        >
                          <Link href={newPath + sub_item.path}>
                            {sub_item.name}
                          </Link>
                        </MenuItem>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <MenuItem onClick={handleClose} key={key}>
                <Link href={parentPath + item.path}>{item.name}</Link>
              </MenuItem>
            );
          })}
        </Menu>
      ) : null}
    </div>
  </>;
}

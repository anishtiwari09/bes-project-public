import { Button } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./DrawerMenu";
export default function MobileMenuList({
  data
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? (
    <DrawerMenu data={data} onClose={() => setIsOpen(false)} />
  ) : (
    <div className="flex justify-end items-center pr-4">
      <Button
        startIcon={<MenuIcon />}
        sx={{ color: "white" }}
        onClick={() => setIsOpen(true)}
      >
        Menu
      </Button>
    </div>
  );
}

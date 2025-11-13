"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@mui/material";
import userDb from "./user_account_db.json";
import UserDrawer from "./UserDrawer";
export default function UserProfile({ isSignIn, userName }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const firstLastName = useMemo(() => {
    let name = userName?.split("") || [];
    return `${name[0] ?? ""}${name[1] ?? ""}`.toUpperCase();
  }, [userName]);
  return isSignIn ? (
    <>
      <UserDrawer
        data={userDb}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        userName={userName}
      />
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-white justify-center items-center rounded-full &hover:bg-red w-fit min-w-fit border border-spacing-1 mt-1 mr-1"
        >
          {firstLastName}
        </Button>
      )}
    </>
  ) : null;
}

"use client";
import React, { useEffect, useMemo, useState } from "react";
import LoginButton from "../LoginButton/LoginButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";
import userDb from "./user_account_db.json";
import UserDrawer from "./UserDrawer";
import { deleteCookiesAction, getUserName } from "@/app/backend/action/action";
import { JSESSIONID } from "@/app/backend/constant";
export default function UserProfile({ isSignIn, deleteCookies, userName }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    try {
      if (deleteCookies) {
        // deleteCookiesAction(JSESSIONID);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
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
  ) : (
    <LoginButton />
  );
}

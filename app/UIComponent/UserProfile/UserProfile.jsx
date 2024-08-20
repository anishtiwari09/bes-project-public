"use client";
import React, { useEffect, useState } from "react";
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
  return isSignIn ? (
    <>
      <UserDrawer
        data={userDb}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        userName={userName}
      />
      {!isOpen && (
        <Button style={{ fontSize: 60 }} onClick={() => setIsOpen(true)}>
          <AccountCircleIcon sx={{ color: "white" }} fontSize="60px" />
        </Button>
      )}
    </>
  ) : (
    <LoginButton />
  );
}

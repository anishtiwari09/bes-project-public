"use client";
import React, { useMemo, useState } from "react";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { Person } from "@mui/icons-material";
import UserDrawer from "./UserDrawer";
import { useAuthContext } from "../context-provider/auth-provider";
export default function UserProfile({ isSignIn, userName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const { onLogout } = useAuthContext();
  const firstLastName = useMemo(() => {
    if (!userName) return "";
    const names = userName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  }, [userName]);
  return isSignIn ? (
    <>
      <UserDrawer
        onLogout={onLogout}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        userName={userName}
      />
      {!isOpen && (
        <Tooltip title={`${userName} - Click to open menu`} arrow>
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              p: 0,
              ml: 1,
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#6b7280",
                color: "white",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "2px solid transparent",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "#4b5563",
                  borderColor: "#e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              {firstLastName || <Person />}
            </Avatar>
          </IconButton>
        </Tooltip>
      )}
    </>
  ) : null;
}

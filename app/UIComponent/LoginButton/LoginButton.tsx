"use client";

import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginForm from "../LoginBox/LoginForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LoginButton() {
  const [openLoginBox, setOpenLoginBox] = useState(false);
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (action === "login") {
      setOpenLoginBox(true);
      router.replace(pathname || "/");
    }
  }, [action, pathname, router]);

  return (
    <>
      {openLoginBox && <LoginForm onClose={() => setOpenLoginBox(false)} />}

      <IconButton
        onClick={() => setOpenLoginBox(true)}
        aria-label="Sign in"
        sx={{
          color: "white",
          p: 0.5,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 32 }} />
      </IconButton>
    </>
  );
}

"use client";
import { Button } from "@mui/material";
import React, { use, useEffect, useState } from "react";
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
  }, [action]);
  return (
    <div className="text-center">
      {openLoginBox && <LoginForm onClose={() => setOpenLoginBox(false)} />}
      <Button
        variant="contained"
        onClick={() => setOpenLoginBox(!openLoginBox)}
        sx={{
          bgcolor: "white",
          color: "#101130",
          px: 3,
          py: 1.2,
          fontSize: "0.875rem",
          fontWeight: "600",
          textTransform: "none",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(16,17,48,0.1)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            bgcolor: "#f8fafc",
            boxShadow: "0 4px 12px rgba(16,17,48,0.15)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 1px 3px rgba(16,17,48,0.1)",
          },
        }}
      >
        Sign In
      </Button>
    </div>
  );
}

"use client";
import { Button } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import LoginForm from "../LoginBox/LoginForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function LoginButton() {
  const [openLoginBox, setOpenLoginBox] = useState(false);
  const searchParams = useSearchParams();
  const action = searchParams.get("action")?.[0];
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
        style={{ background: "orange" }}
        variant="contained"
        onClick={() => setOpenLoginBox(!openLoginBox)}
      >
        Login
      </Button>
    </div>
  );
}

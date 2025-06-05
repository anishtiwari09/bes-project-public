"use client";
import { Button } from "@mui/material";
import React, { useState } from "react";
import LoginForm from "../LoginBox/LoginForm";
export default function LoginButton() {
  const [openLoginBox, setOpenLoginBox] = useState(false);

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

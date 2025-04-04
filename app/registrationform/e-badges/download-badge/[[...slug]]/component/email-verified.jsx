"use client";

import OTP from "@/app/registrationform/Form/otpinput";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function EmailVerifingBox({ maskedEmail, urn }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const onSubmit = async () => {
    setIsDisabled(true);
    setErrorMsg("");
    const res = await fetch("/backend/api/verify-and-generate-badge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, urn: urn }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", urn + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      const err = await res.json();
      setErrorMsg(err?.message);
      setIsDisabled(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        width: "100%",
        boxShadow: "0 0 20px #b5b3b3;",
        padding: 2.5,
        borderRadius: "3px",
      }}
      className="bg-white w-full min-w-full mt-5"
    >
      <Stack gap={2} justifyContent={"center"} margin={"auto"}>
        <Typography
          variant="h5"
          textAlign="center"
          sx={{
            fontWeight: 400, // Regular weight for clarity
            color: "text.primary", // Uses the default Material UI theme text color
            // More subtle spacing

            lineHeight: 1.5, // Makes the text more readable
            fontSize: "1rem", // Regular font size for readability
            letterSpacing: "0.5px", // Subtle letter spacing for polished look
          }}
        >
          A one-time password (OTP) has been sent to your registered email:{" "}
          {maskedEmail}
        </Typography>
        {errorMsg && (
          <Alert
            sx={{
              textAlign: "center",
              width: "fit-content",
              minWidth: 300,
              margin: "auto",
              color: "red",
            }}
            closeText="hhhh"
            severity="error"
          >
            {errorMsg}
          </Alert>
        )}
        <Stack w="fit-content" margin={"auto"}>
          <OTP
            separator={" "}
            value={otp}
            disabled={isDisabled}
            onChange={isDisabled ? () => {} : setOtp}
            length={4}
          />
        </Stack>
        <Button
          variant="contained"
          sx={{
            width: "fit-content",
            margin: "auto",
            minWidth: 200,
            minHeight: 45,
          }}
          disabled={isDisabled}
          onClick={onSubmit}
        >
          {" "}
          {isDisabled ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Download Badge"
          )}
        </Button>
        <Typography variant="body2" textAlign={"center"}>
          We will send you a one time password to verify your email address
        </Typography>
      </Stack>
    </Box>
  );
}

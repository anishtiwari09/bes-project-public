"use client";
import OTP from "@/app/registrationform/Form/otpinput";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";

export default function EmailVerifingBox({ maskedEmail }) {
  const onSubmit = () => {};
  const { pending } = useFormStatus();
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
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
      <form onSubmit={onSubmit}>
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
          <Stack w="fit-content" margin={"auto"}>
            <OTP
              separator={" "}
              value={otp}
              disabled={pending}
              onChange={pending ? () => {} : setOtp}
              length={4}
            />
          </Stack>
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "fit-content",
              margin: "auto",
              minWidth: 200,
              minHeight: 45,
            }}
            disabled={pending}
          >
            {" "}
            {pending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Download Badge"
            )}
          </Button>
          <Typography variant="body2" textAlign={"center"}>
            We will send you a one time password to verify your email address
          </Typography>
        </Stack>
      </form>
    </Box>
  );
}

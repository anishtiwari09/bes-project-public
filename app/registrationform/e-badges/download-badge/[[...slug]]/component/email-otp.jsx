import { Box, Stack, Typography } from "@mui/material";
import React from "react";

export default function EmailOtp() {
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
      <form action={formAction} onSubmit={onSubmit}>
        <Stack gap={2} justifyContent={"center"} margin={"auto"}>
          <Typography variant="h5" textAlign={"center"}>
            Enter your email address
          </Typography>

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
              "Send OTP"
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

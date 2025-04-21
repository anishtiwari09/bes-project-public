"use client";
import { getVisitorDetails } from "@/app/backend/action/action";
import {
  Box,
  Stack,
  Typography,
  Input,
  Button,
  CircularProgress,
} from "@mui/material";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

import React, { FormEvent, use, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: "",
  status: false,
  isError:false
};
export default function EmailAddressBox() {
  const [state, formAction] = useFormState(getVisitorDetails, initialState);
  const { pending } = useFormStatus();
  const [forceUpdate, setForceUpdate] = React.useState(false);
  const onChange = () => {
    state.message = "";
    state.status = false;
    state.isError = false;
    setForceUpdate(!forceUpdate);
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    if (!email?.trim() || pending) {
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (state.status) {
      redirect("/registrationform/e-badges/download-badge/" + state?.urn);
    }
  }, [state.status]);
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
          {state?.message && !state?.status && (
            <Typography
              variant="body2"
              textAlign={"center"}
              color={state?.status ? "green" : "red"}
            >
              {state?.message}
            </Typography>
          )}
          <Input
            onChange={onChange}
            type={"email"}
            name="email"
            placeholder="Enter your email address"
            sx={{
              maxWidth: 700,
              minWidth: 300,
              margin: "auto",
              "& .MuiInputBase-input": {
                textAlign: "center",
              },
            }}
            error={state?.isError}
          />

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

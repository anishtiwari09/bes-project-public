"use client";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateMyAccountDetails } from "@/app/backend/action/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState, useFormStatus } from "react-dom";
import { accountSchema } from "@/app/helper/accountSchema";

export default function PersonalInformation({
  name,
  mobile,
  email,
  organisation,
  designation,
  city,
  country,
  isVerified,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      mobile,
      organisation,
      designation,
      city,
      country,
    },
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = (data, e, y) => {
    return e.target.submit();
  };
  const initialState = {
    message: "",
    status: false,
    token: "",
  };
  const [state, formAction] = useFormState(
    updateMyAccountDetails,
    initialState
  );
  const [snackbarStatus, setSnackbarStatus] = useState(state.status);
  useEffect(() => {
    setSnackbarStatus(state.status);
  }, [state]);
  return (
    <Stack sx={{ width: "95%", margin: "16px auto", maxWidth: 1200 }} gap={2}>
      <Snackbar
        open={snackbarStatus}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setSnackbarStatus(false)}
      >
        {
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            {state.message}
          </Alert>
        }
      </Snackbar>
      {!isVerified && (
        <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
          {"Your account is not verified please contact to admin."}
        </Alert>
      )}
      {!state.status && state.message && (
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {state.message}
        </Alert>
      )}
      <Box>
        <Typography variant="h5">Personal Information</Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)} action={formAction}>
        <Stack
          flexWrap={"wrap"}
          flexDirection={{ md: "row", base: "column" }}
          gap={2}
          className="personalInformation"
        >
          <TextField
            placeholder={"Name"}
            {...register("name")}
            error={errors?.name}
            defaultValue={name}
            helperText={errors?.name ? errors?.name?.message : ""}
            sx={{
              width: { md: "calc((100% - 2rem) / 2) " },
              input: { textTransform: "capitalize" },
            }}
            style={{ textTransform: "capitalize" }}
          />
          <TextField
            placeholder={"Email"}
            disabled
            value={email}
            sx={{ width: { md: "calc((100% - 2rem) / 2) " } }}
          />
          <TextField
            placeholder={"Mobile"}
            {...register("mobile")}
            error={errors?.mobile}
            helperText={errors?.mobile ? errors?.mobile?.message : ""}
            sx={{ width: { md: "calc((100% - 2rem) / 2) " } }}
          />
          <TextField
            placeholder={"Designation"}
            {...register("designation")}
            error={errors?.designation}
            helperText={errors?.designation ? errors?.designation?.message : ""}
            sx={{
              width: { md: "calc((100% - 2rem) / 2) " },
              input: { textTransform: "uppercase" },
            }}
          />
          <TextField
            placeholder={"Organisation"}
            {...register("organisation", {
              required: "This field is required",
            })}
            error={errors?.organisation}
            helperText={
              errors?.organisation ? errors?.organisation?.message : ""
            }
            sx={{
              width: { md: "calc((100% - 2rem) / 2) " },
              input: { textTransform: "capitalize" },
            }}
          />
          <TextField
            placeholder={"City"}
            {...register("city", {
              required: "This field is required",
              pattern: /^[a-zA-Z\s]+$/,
            })}
            error={errors?.city}
            helperText={errors?.city ? errors?.city?.message : ""}
            sx={{
              width: { md: "calc((100% - 2rem) / 2) " },
              input: { textTransform: "capitalize" },
            }}
          />
          <TextField
            placeholder={"Country"}
            {...register("country", {
              required: "This field is required",
            })}
            error={errors?.country}
            helperText={errors?.country ? errors?.country?.message : ""}
            sx={{
              width: { md: "calc((100% - 2rem) / 2) " },
              input: { textTransform: "capitalize" },
            }}
          />
          <Box width={"100%"} display={"flex"} justifyContent={"center"}>
            <SubmitButton />
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        variant="contained"
        style={
          pending
            ? { color: "white" }
            : {
                background: "blue",
                width: "fit-content",
                margin: "auto",
              }
        }
        type="Forgot"
        disabled={pending}
      >
        {pending ? "Please wait..." : "Submit"}
      </Button>
    </>
  );
};

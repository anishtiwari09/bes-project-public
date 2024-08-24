"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { userLoginAction } from "@/app/backend/action/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState, useFormStatus } from "react-dom";
import { z } from "zod";
const isPureString = (string) => {
  let regex = /^[a-zA-Z\s]+$/;

  return regex.test(string);
};
const schema = z.object({
  name: z
    .string()
    .min(1, { message: "This field is required" })
    .refine(isPureString, { message: "Only alphabets are allowed" }),
  mobile: z
    .string()
    .transform((val) => (isNaN(Number(val)) ? 0 : val.length))
    .pipe(z.number().min(10, "This is not valid")),
  organisation: z.string().min(3, { message: "This field is required" }),
  designation: z.string().min(3, { message: "This field is required" }),
  city: z.string().min(3, { message: "This field is required" }),
  country: z.string().min(1, { message: "This field is required" }),
});
export default function PersonalInformation({
  name,
  mobile,
  email,
  organisation,
  designation,
  city,
  country,
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
    resolver: zodResolver(schema),
  });

  const onSubmit = (data, e, y) => {
    return e.target.submit();
  };
  const initialState = {
    message: "",
    status: false,
    token: "",
  };
  const [state, formAction] = useFormState(userLoginAction, initialState);
  return (
    <Stack sx={{ width: "95%", margin: "16px auto", maxWidth: 1200 }} gap={2}>
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

"use client";
import {
  createNewPasswordAction,
  signUpAction,
} from "@/app/backend/action/action";
import { emailValidator, numberValidator } from "@/app/Utility/validator";
import { Alert, Box, Button, Card, Stack, Typography } from "@mui/material";
import { Password } from "primereact/password";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Divider } from "primereact/divider";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { isValidPassword } from "@/app/helper/helper";

const initialState = {
  message: "",
  status: false,
};

export default function CreateNewPassword({
  slug1,
  slug2
}: any) {
  const [state, formAction] = useFormState(
    (data1: any, data2: any) => createNewPasswordAction(data1, data2, slug1, slug2),
    initialState
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const onSubmit = (e: any) => {
    setErrorMsg("");
    if (!isValidPassword(password1)) {
      setErrorMsg("Your password is week, please use strong password");
      e.preventDefault();

      return;
    }
    if (password1 !== password2) {
      setErrorMsg("Password is not matched");
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="w-full h-full flex-1 py-20 bg-[#f2f2f2]">
      <Card
        sx={{
          minHeight: 200,
          minWidth: 500,
          maxWidth: 500,
          padding: 2,
          width: "fit-content",
          margin: "auto",
        }}
      >
        {state?.status ? (
          <Typography
            variant="h4"
            textAlign={"center"}
            className="text-green-700"
          >
            {state.message}
          </Typography>
        ) : (
          <form action={formAction} onSubmit={onSubmit}>
            <Stack gap={1} justifyContent={"center"} margin={"auto"}>
              <Box>
                <Typography variant="h5">Create New Password</Typography>
              </Box>
              {errorMsg && <Alert severity={"error"}>{errorMsg}</Alert>}
              <Box>
                {state?.message && (
                  <Alert severity={state?.status ? "success" : "error"}>
                    {state.message}
                  </Alert>
                )}
              </Box>

              <NewPassword state={password1} setState={setPassword1} />
              <Password
                key={1}
                value={password2}
                name="password2"
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Re-enter a password"
                toggleMask
                inputStyle={{ width: "100%" }}
                feedback={false}
                inputClassName={`${
                  password1 === password2 && password2.trim()
                    ? "border-green-500"
                    : ""
                } w-full`}
                style={{ width: "100%" }}
                className="basicPassword w-full"
                inputMode="none"
                invalid={password2.trim() ? password1 !== password2 : false}
              />

            
              <SubmitButton />
            </Stack>
          </form>
        )}
      </Card>
    </div>
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
        type="submit"
        disabled={pending}
      >
        {pending ? "Submiting" : "Submit"}
      </Button>
    </>
  );
};
const NewPassword = ({
  state,
  setState
}: any) => {
  const header = <div className="font-bold mb-3">Pick a password</div>;
  let lowerCaseRegex = /(?=.*[a-z])/;
  let upperCaseRegex = /(?=.*[A-Z])/;
  let specialCaseRegex = /[-+_!@#$%^&*.,?]/;
  let numericCharacterRegex = /(?=.*\d)/;

  const defaultColor = "text-green-300";
  const lowerCharacterClassName = lowerCaseRegex.test(state)
    ? defaultColor
    : "";
  const upperCharacterClassName = upperCaseRegex.test(state)
    ? defaultColor
    : "";
  const specialCharacterClassName = specialCaseRegex.test(state)
    ? defaultColor
    : "";
  const numericCharacterClassName = numericCharacterRegex.test(state)
    ? defaultColor
    : "";
  const minimumCharacterClassName =
    state.trim().length >= 8 ? defaultColor : "";
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li className={lowerCharacterClassName}>At least one lowercase</li>
        <li className={upperCharacterClassName}>At least one uppercase</li>
        <li className={numericCharacterClassName}>At least one numeric</li>
        <li className={specialCharacterClassName}>
          At least one special character
        </li>
        <li className={minimumCharacterClassName}>Minimum 8 characters</li>
      </ul>
    </>
  );
  return (
    <Password
      key={1}
      value={state}
      invalid={state.trim() ? !isValidPassword(state) : false}
      inputClassName={`${
        state.trim() && isValidPassword(state) ? "border-green-500" : ""
      } w-full`}
      name="password"
      onChange={(e) => setState(e.target.value)}
      className="basicPassword w-full"
      placeholder="Enter a password"
      weakLabel="Too simple"
      mediumLabel="Average complexity"
      strongLabel="Complex password"
      toggleMask
      header={header}
      footer={footer}
    />
  );
};

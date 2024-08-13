"use client";
import { signUpAction } from "@/app/backend/action/action";
import { emailValidator, numberValidator } from "@/app/Utility/validator";
import {
  Alert,
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: "",
  status: false,
};
const initialFormState = [
  {
    type: "text",
    fieldName: "Name",
    id: "name",
    value: "",
    isError: false,
    errorMsg: "This Field is required",
  },
  {
    type: "text",
    fieldName: "Mobile",
    id: "mobile",
    value: "",
    isError: false,
    errorMsg: "This Field is required",
  },
  {
    type: "email",
    fieldName: "Email",
    id: "email",
    value: "",
    isError: false,
    errorMsg: "This Field is required",
  },
  {
    type: "text",
    fieldName: "Organisation",
    id: "organisation",
    value: "",
    isError: false,
    errorMsg: "This Field is required",
  },
  {
    type: "text",
    fieldName: "City",
    id: "city",
    value: "",
    isError: false,
    errorMsg: "This Field is required",
  },
];
export default function SignupBox() {
  const [state, formAction] = useFormState(signUpAction, initialState);
  console.log(state);
  const [formState, setFormState] = useState(initialFormState);
  const handleChange = (e, index) => {
    const { value, name } = e.target;
    if (name === "mobile") {
      let isValid = numberValidator(value);
      if (!isValid) return;
    }
    formState[index].isError = false;
    formState[index].value = value;
    setFormState([...formState]);
  };
  const onSubmit = (e) => {
    let isValid = true;
    let newForm = formState.map((item) => {
      let { value, name } = item;
      if (!value.trim()) {
        isValid = false;
        item.isError = true;
        item.errorMsg = "This Field is required";
      } else if (name === "mobile") {
        if (!numberValidator(value)) {
          item.errorMsg = "Please Enter valid Number";
          isValid = false;
        }
      } else if (name === "email") {
        if (!emailValidator(value)) {
          item.errorMsg = "Please Enter valid Number";
          isValid = false;
        }
      }
      return item;
    });
    if (!isValid) {
      setFormState(newForm);
      e.preventDefault();
    } else {
      setFormState(initialFormState);
    }
  };

  return (
    <div className="w-full h-full flex-1 py-20 bg-[#f2f2f2]">
      <form action={formAction} onSubmit={onSubmit}>
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
          <Stack gap={1} justifyContent={"center"} margin={"auto"}>
            <Box>
              <Typography variant="h5">Create New Account</Typography>
            </Box>
            <Box>
              {state?.message && (
                <Alert severity={state?.status ? "success" : "error"}>
                  {state.message}
                </Alert>
              )}
            </Box>

            {formState.map((item, i) => (
              <TextField
                placeholder={item.fieldName}
                name={item?.id}
                type={item.type}
                key={item.id}
                error={item.isError}
                helperText={item.isError ? item?.errorMsg : ""}
                required={true}
                onChange={(e) => handleChange(e, i)}
                value={item.value}
              />
            ))}
            <SubmitButton formState={formState} setFormState={setFormState} />
          </Stack>
        </Card>
      </form>
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

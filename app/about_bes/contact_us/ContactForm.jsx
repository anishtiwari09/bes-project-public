"use client";
import { useFormState, useFormStatus } from "react-dom";

import Form from "@/app/registrationform/Form/Form";
import { Alert, Box } from "@mui/material";
import { contactUsAction } from "@/app/backend/action/action";
import { useRef } from "react";
const initialState = {
  message: "",
  status: false,
};
export default function ContactForm({ db }) {
  const [state, formAction] = useFormState(contactUsAction, initialState);
  const formRef = useRef();
  const handleFormSubmit = () => {
    formRef.current.submit();
  };
  console.log(state);
  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}
        action={formAction}
      >
        <Box>
          {state?.message && (
            <Alert severity={state?.status ? "success" : "error"}>
              {state.message}
            </Alert>
          )}
        </Box>
        <Form
          db={db}
          isBypassEmailValidation={true}
          onClick={handleFormSubmit}
        />
      </form>
    </>
  );
}

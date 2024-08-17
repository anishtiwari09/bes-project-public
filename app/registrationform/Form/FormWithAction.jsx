"use client";
import { useFormState, useFormStatus } from "react-dom";

import Form from "@/app/registrationform/Form/Form";
import { Alert, Box } from "@mui/material";
import { useRef } from "react";
const initialState = {
  message: "",
  status: false,
};
export default function FormWithAction({ formActionHandler, db }) {
  const [state, formAction] = useFormState(formActionHandler, initialState);
  const formRef = useRef();
  const handleFormSubmit = (vistorDb, submitButtonRef) => {
    console.log("1");
    // event.stopPropagation
    formRef.current.submit();
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          console.log("2");
          e.preventDefault();
        }}
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

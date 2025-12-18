import { forgotPasswordAction } from "@/app/backend/action/action";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";

const initialState = {
  message: "",
  status: false,
};

export default function ForgotPasswordForm({ onClose }) {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.status) {
      setEmail("");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Stack gap={2} justifyContent={"center"} margin={"auto"}>
        <Box>
          <Typography variant="h5">Forgot Password</Typography>
        </Box>
        <Box style={{ maxWidth: "100%" }}>
          {state?.message && (
            <Alert severity={state?.status ? "success" : "error"}>
              {state.message}
            </Alert>
          )}
        </Box>
        <TextField
          placeholder="Registered Email Id"
          type={"email"}
          required={true}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          style={
            isPending
              ? { color: "white" }
              : {
                  background: "blue",
                  width: "fit-content",
                  margin: "auto",
                }
          }
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting" : "Submit"}
        </Button>
      </Stack>
    </form>
  );
}

import {
  Alert,
  Box,
  Button,
  Card,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useFormStatus } from "react-dom";
import { userLoginAction } from "@/app/backend/action/action";
import toast from "react-hot-toast";
import { useAuthContext } from "../context-provider/auth-provider";
const initialState = {
  message: "",
  status: false,
  token: "",
  userData: null,
  isLogin: false,
};
export default function LoginForm({ onClose }: any) {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [state, formAction] = useActionState(userLoginAction, initialState);
  const { setUserData } = useAuthContext();
  useEffect(() => {
    if (state?.isLogin && state?.userData) setUserData(state?.userData || null);
  }, [state?.userData]);
  useEffect(() => {
    if (state.userData && state?.isLogin) {
      toast(
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {state.message}
        </Alert>,
        {
          duration: 4000,
          position: "top-center",

          // Styling
          style: {},
          className: "",

          // Custom Icon

          // Change colors of success/error/loading icon

          // Aria
          ariaProps: {
            "aria-live": "polite",
            role: "status",
          },
        }
      );
      router.push("/user/profile");
      onClose();
    }
  }, [state]);
  return (
    <>
      {state.status && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            {state.message}
          </Alert>
        </Snackbar>
      )}

      <Modal open={true} onClose={onClose} sx={{ display: "flex" }}>
        <Card
          sx={{
            minHeight: 200,
            minWidth: 400,
            padding: 2,
            width: "fit-content",
            maxWidth: 400,
            margin: "auto",
          }}
        >
          {isForgotPassword ? (
            <ForgotPasswordForm onClose={onClose} />
          ) : (
            <form action={formAction}>
              <Stack gap={1} justifyContent={"center"} margin={"auto"}>
                <Box>
                  <Typography variant="h5">Member Login</Typography>
                </Box>
                {state?.message && !state.status && (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {state.message}
                  </Alert>
                )}
                <TextField
                  placeholder="Registered Email Id"
                  required={true}
                  type={"email"}
                  name="email"
                />

                <TextField
                  placeholder="Password"
                  name="password"
                  type="password"
                  required={true}
                />
                <SubmitButton />
                <Button
                  sx={{ border: "1px solid blue" }}
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password
                </Button>
                <Button
                  sx={{ border: "1px solid blue" }}
                  onClick={() => {
                    router.push("/member_signup");
                    onClose();
                  }}
                >
                  Create New Account
                </Button>
              </Stack>
            </form>
          )}
        </Card>
      </Modal>
    </>
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
        {pending ? "Please wait..." : "Login"}
      </Button>
    </>
  );
};

import {
  Box,
  Button,
  Card,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginForm({ onClose }) {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  return (
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
          <Stack gap={1} justifyContent={"center"} margin={"auto"}>
            <Box>
              <Typography variant="h5">Member Login</Typography>
            </Box>
            <TextField placeholder="Registered Email Id" />

            <TextField placeholder="Password" />
            <Button
              variant="contained"
              style={{
                background: "blue",
                width: "fit-content",
                margin: "auto",
              }}
            >
              Login
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
            <Button
              sx={{ border: "1px solid blue" }}
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password
            </Button>
          </Stack>
        )}
      </Card>
    </Modal>
  );
}

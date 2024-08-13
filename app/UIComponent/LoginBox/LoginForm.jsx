import {
  Box,
  Button,
  Card,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ onClose }) {
  const router = useRouter();

  return (
    <Modal open={true} onClose={onClose} sx={{ display: "flex" }}>
      <Card
        sx={{
          minHeight: 200,
          minWidth: 400,
          padding: 2,
          width: "fit-content",
          margin: "auto",
        }}
      >
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
          <Button sx={{ border: "1px solid blue" }}>Forgot Password</Button>
        </Stack>
      </Card>
    </Modal>
  );
}

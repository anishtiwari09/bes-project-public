"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { signUpAction } from "@/app/backend/action/action";
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/app/_shared/validation-schema";
import { z } from "zod";

type SignupFormType = z.infer<typeof signupSchema>;
const PREV_STATE = {
  message: "",
  status: false,
};

export default function SignupBox() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    PREV_STATE
  );

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // validate on change
    reValidateMode: "onSubmit", // re-validate on submit as well
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormType) => {
    startTransition(async () => {
      formAction(data);
    });
  };

  useEffect(() => {
    if (state?.status) {
      reset();
    }
  }, [state?.status]);
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <Card className="shadow-xl rounded-2xl p-8 border border-gray-200">
          <Stack gap={3}>
            {/* Title */}
            <Box textAlign="center">
              <Typography
                variant="h4"
                fontWeight="bold"
                className="text-gray-800"
              >
                Create Account
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Fill in your details to get started 🚀
              </Typography>
            </Box>

            {/* Status Message */}

            {!!state?.message && (
              <Alert
                severity={state?.status ? "success" : "error"}
                className="rounded-lg"
              >
                {state.message}
              </Alert>
            )}

            {/* Inputs */}
            <TextField
              label="First Name"
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Last Name"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Email Address"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <SubmitButton pending={isPending} />
          </Stack>
        </Card>
      </form>
    </div>
  );
}

// Custom Submit Button
const SubmitButton = ({ pending }: { pending: boolean }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
      sx={{
        background: "linear-gradient(90deg, #2563eb, #1e40af)",
        ":hover": { background: "linear-gradient(90deg, #1e40af, #1e3a8a)" },
        opacity: pending ? 0.4 : 1,
      }}
    >
      {pending ? (
        <CircularProgress size={22} sx={{ color: "white" }} />
      ) : (
        "Sign Up"
      )}
    </Button>
  );
};

import { toast } from "react-hot-toast";
import { Alert } from "@mui/material";

export function showErrorToast(message: string = "Something went wrong") {
  toast(
    <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
      {message}
    </Alert>,
    {
      duration: 4000,
      position: "top-center",
      ariaProps: {
        "aria-live": "polite",
        role: "status",
      },
    }
  );
}

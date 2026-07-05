"use client";

import { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ENVIROMENT } from "../../backend/constant";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (!navigator.onLine) return;
      setShowOffline(false);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Snackbar
        open={showOffline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setShowOffline(false)}
        >
          You are offline. Some features may be unavailable.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showBackOnline}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
        onClose={() => setShowBackOnline(false)}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Back online!
        </Alert>
      </Snackbar>
    </>
  );
}

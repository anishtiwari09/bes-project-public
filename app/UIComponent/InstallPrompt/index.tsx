"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button, Snackbar, Alert, Typography } from "@mui/material";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const hasPrompt = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;

    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIos(isIosDevice);

    const isStandalone =
      (navigator as any).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsInstalled(isStandalone);
    if (isStandalone) return;
    if (isIosDevice) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      hasPrompt.current = true;
      setShowFallback(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    const timer = setTimeout(() => {
      if (!hasPrompt.current) setShowFallback(true);
    }, 10000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  if (process.env.NODE_ENV !== "production") return null;
  if (isInstalled) return null;
  if (dismissed) return null;

  if (isIos) {
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ width: "100%", alignItems: "center" }}
          action={
            <Button
              size="small"
              variant="text"
              sx={{ color: "white", textTransform: "none" }}
              onClick={() => setDismissed(true)}
            >
              Dismiss
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600}>
            Install BES Expo App
          </Typography>
          <Typography variant="caption">
            Tap Share &nbsp;⎋&nbsp; then &quot;Add to Home Screen&quot;
          </Typography>
        </Alert>
      </Snackbar>
    );
  }

  if (deferredPrompt) {
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            alignItems: "center",
            bgcolor: "#75c24c",
            "& .MuiAlert-icon": { color: "white" },
          }}
          action={
            <>
              <Button
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "#75c24c",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
                onClick={handleInstall}
              >
                Install
              </Button>
              <Button
                size="small"
                variant="text"
                sx={{ color: "white", textTransform: "none", ml: 1 }}
                onClick={() => setDismissed(true)}
              >
                Not now
              </Button>
            </>
          }
        >
          <Typography variant="body2" fontWeight={600}>
            Install BES Expo App
          </Typography>
          <Typography variant="caption">
            Install for offline access and a better experience
          </Typography>
        </Alert>
      </Snackbar>
    );
  }

  if (showFallback) {
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ width: "100%", alignItems: "center" }}
          action={
            <Button
              size="small"
              variant="text"
              sx={{ color: "white", textTransform: "none" }}
              onClick={() => setDismissed(true)}
            >
              Dismiss
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600}>
            Install BES Expo App
          </Typography>
          <Typography variant="caption">
            Open browser menu and tap &quot;Add to Home Screen&quot;
          </Typography>
        </Alert>
      </Snackbar>
    );
  }

  return null;
}

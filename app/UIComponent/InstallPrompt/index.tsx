"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Box, Typography } from "@mui/material";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "production")
      return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const checkInstalled = () => {
      if (
        (navigator as any).standalone ||
        window.matchMedia("(display-mode: standalone)").matches
      ) {
        setIsInstalled(true);
      }
    };
    checkInstalled();

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
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

  if (
    isInstalled ||
    !deferredPrompt ||
    dismissed ||
    process.env.NODE_ENV !== "production"
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 9999,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 6,
        p: 2,
        maxWidth: 320,
      }}
    >
      <Typography variant="body2" fontWeight={600} mb={0.5}>
        Install BES Expo App
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={1.5}
      >
        Install for offline access and a better experience
      </Typography>
      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant="contained"
          onClick={handleInstall}
          sx={{ bgcolor: "#75c24c", "&:hover": { bgcolor: "#5fa83a" } }}
        >
          Install
        </Button>
        <Button size="small" variant="text" onClick={() => setDismissed(true)}>
          Not now
        </Button>
      </Box>
    </Box>
  );
}

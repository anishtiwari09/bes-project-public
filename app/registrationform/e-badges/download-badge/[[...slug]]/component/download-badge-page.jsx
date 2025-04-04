"use client";
import { Box, Typography, Container } from "@mui/material";

import React from "react";

export default function DownloadBadgePage({ children }) {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Box marginBottom={2}>
        <Typography variant="h3" textAlign={"center"}>
          Download your e-badge
        </Typography>
      </Box>
      {children}
    </Container>
  );
}

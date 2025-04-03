"use client";
import { Box, Typography, Container } from "@mui/material";

import React from "react";

export default function DownloadBadgePage({ children }) {
  return (
    <Container>
      <Box>
        <Typography variant="h5">Download your e-badge</Typography>
      </Box>
      {children}
    </Container>
  );
}

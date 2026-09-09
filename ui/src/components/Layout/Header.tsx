// QuietPay header - Apache-2.0
import React from "react";
import { AppBar, Box, Chip, Toolbar, Typography } from "@mui/material";
export const Header: React.FC = () => (
  <AppBar position="static" data-testid="header" sx={{ backgroundColor: "#0A0C0D", borderBottom: "1px solid rgba(255,255,255,0.08)" }} elevation={0}>
    <Toolbar sx={{ display: "flex", justifyContent: "space-between", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} data-testid="header-logo">
        <img src="/midnight-logo.png" alt="logo-image" height={28} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>QuietPay</Typography>
        <Typography variant="body2" color="text.secondary">Private payroll on Midnight</Typography>
      </Box>
      <Chip label="Preprod" color="secondary" variant="outlined" size="small" />
    </Toolbar>
  </AppBar>
);

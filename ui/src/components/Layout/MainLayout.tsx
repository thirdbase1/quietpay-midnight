// QuietPay console shell - Apache-2.0
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { Header } from "./Header";
export const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Payroll vaults</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Deploy a vault or join one by address. Totals are public, salaries stay private.</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start" }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

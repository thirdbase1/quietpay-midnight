// QuietPay console theme - Apache-2.0
import { createTheme } from "@mui/material";
export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0A0C0D", paper: "#121517" },
    primary: { main: "#EDEFEA", contrastText: "#0A0C0D" },
    secondary: { main: "#34D399" },
    success: { main: "#34D399" },
    warning: { main: "#E8B44A" },
    error: { main: "#F2555A" },
    text: { primary: "#F2F4F3", secondary: "#98A1A6" },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: { styleOverrides: { root: { backgroundColor: "#121517", border: "1px solid rgba(255,255,255,0.08)" } } },
    MuiTextField: { styleOverrides: { root: { marginTop: 8 } } },
    MuiButton: { styleOverrides: { root: { marginRight: 8, marginTop: 8 } } },
  },
});

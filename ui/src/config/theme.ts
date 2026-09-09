// QuietPay console theme - NullPay-adapted golden dark system - Apache-2.0
import { createTheme } from "@mui/material";
export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000", paper: "#09090b" },
    primary: { main: "#f97316", contrastText: "#ffffff" },
    secondary: { main: "#a1a1aa", contrastText: "#000000" },
    success: { main: "#EDEFEA", contrastText: "#000000" },
    warning: { main: "#f59e0b", contrastText: "#000000" },
    error: { main: "#ef4444", contrastText: "#ffffff" },
    text: { primary: "#ffffff", secondary: "#a1a1aa" },
    divider: "rgba(249, 115, 22, 0.2)",
  },
  typography: {
    fontFamily: ["Space Grotesk", "Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)" } } },
    MuiTextField: { styleOverrides: { root: { marginTop: 8 } } },
    MuiButton: {
      styleOverrides: {
        root: { marginRight: 8, marginTop: 8, borderRadius: 12 },
        containedPrimary: { boxShadow: "0 4px 20px -1px rgba(249,115,22,0.3)" },
      },
    },
  },
});

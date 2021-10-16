import { createTheme } from "@mui/material";
import "typeface-roboto";

const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#4687ff",
    },
    secondary: {
      main: "#6e7375",
    },
    background: {
      default: "#192231",
      paper: "#24344d",
    },
    text: {
      primary: "#ffffff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontSize: 15,
    fontFamily: "Roboto",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    htmlFontSize: 16,
  },
});

export default theme;

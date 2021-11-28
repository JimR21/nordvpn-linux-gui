import { CssBaseline } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import theme from "./CustomTheme";
import Root from "./Root";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Root />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

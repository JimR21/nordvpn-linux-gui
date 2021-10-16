import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./CustomTheme";
import Root from "./Root";
import { CssBaseline } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";

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

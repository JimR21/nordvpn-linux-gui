import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import LogIn from "./LogIn";
import { Container } from "@mui/material";
import { Grid3x3 } from "@mui/icons-material";
import Dashboard from "./Dashboard";

ipcRenderer.on("cli-login", (event, data) => {
  console.log("Caught cli-login");
  console.log(data.output);
});

const App = () => {
  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    ipcRenderer.send("cli:is-logged-in");
    ipcRenderer.on("cli:logged-in", (e, loggedIn) => {
      console.log(`loggedIn: ${loggedIn}`);
      setloggedIn(loggedIn);
    });
  }, []);

  if (!loggedIn) {
    return <LogIn></LogIn>;
  }
  return (
    <Container>
      <Dashboard></Dashboard>
    </Container>
  );
};

export default App;

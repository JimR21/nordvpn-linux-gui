import { Alert, Snackbar } from "@mui/material";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import LogIn from "./LogIn";

const Root = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    ipcRenderer.send("cli:is-logged-in");
    ipcRenderer.on("cli:logged-in", (e, loggedIn) => {
      setLoggedIn(loggedIn);
    });
  }, []);

  return <div>{loggedIn ? <Dashboard /> : <LogIn />}</div>;
};

export default Root;

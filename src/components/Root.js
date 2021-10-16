import { Alert, Snackbar } from "@mui/material";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import LogIn from "./LogIn";

ipcRenderer.on("cli-login", (event, data) => {
  console.log("Caught cli-login");
  console.log(data.output);
});

const Root = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    ipcRenderer.send("cli:is-logged-in");
    ipcRenderer.on("cli:logged-in", (e, loggedIn) => {
      console.log(`loggedIn: ${loggedIn}`);
      setLoggedIn(loggedIn);
    });
  }, []);

  const handleLoginStatusUpdate = (updatedLoggedIn) => {
    console.log(`Handling login status update to ${updatedLoggedIn}`);
    setLoggedIn(updatedLoggedIn);
  };

  return (
    <div>
      {loggedIn ? (
        <Dashboard loginUpdate={handleLoginStatusUpdate} />
      ) : (
        <LogIn />
      )}
    </div>
  );
};

export default Root;

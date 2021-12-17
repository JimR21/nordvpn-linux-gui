import { Alert, Snackbar } from "@mui/material";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import LogIn from "./LogIn";

const Root = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    ipcRenderer.on("cli:error", (e, errMsg) => {
      errMsg = errMsg.replace(/(-|\\|\||\/)/g, "");
      errMsg.trim();
      setError(errMsg);
    });
  }, [error]);

  useEffect(() => {
    ipcRenderer.send("cli:is-logged-in");
    ipcRenderer.on("cli:logged-in", (e, loggedIn) => {
      setLoggedIn(loggedIn);
    });
  }, []);

  return (
    <div>
      {loggedIn ? <Dashboard /> : <LogIn />}{" "}
      <div>
        {error ? (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setError(null)}>
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        ) : null}
      </div>
    </div>
  );
};

export default Root;

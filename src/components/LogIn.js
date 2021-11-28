import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ipcRenderer } from "electron";
import { Alert, CircularProgress, Grid, Snackbar } from "@mui/material";

export default function LogIn() {
  const [loginError, setLoginError] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    ipcRenderer.on("cli:login-error", (e, errMsg) => {
      setLoginError(errMsg);
      setLoader(false);
    });
  }, [loginError]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
    };

    // Send credentials to main
    ipcRenderer.send("cli:login", credentials);
    setLoader(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Grid container columnSpacing={5} sx={{ mt: 3, mb: 2 }}>
            <Grid item xs={5}>
              <Button type="submit" fullWidth variant="contained">
                Sign In
              </Button>
            </Grid>
            {loader ? (
              <Grid item xs={1}>
                <Box>
                  <CircularProgress />
                </Box>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Box>
      <div>
        {loginError ? (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setLoginError(null)}>
            <Alert severity="error" sx={{ width: "100%" }}>
              {loginError}
            </Alert>
          </Snackbar>
        ) : null}
      </div>
    </Container>
  );
}

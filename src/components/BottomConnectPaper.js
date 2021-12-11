import { Button, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import { ipcRenderer } from "electron";
import React from "react";

const ConnectButton = styled(Button)(({ theme }) => ({
  color: "white",
  whiteSpace: "nowrap",
}));

const DisconnectButton = styled(Button)(({ theme }) => ({
  color: "white",
  whiteSpace: "nowrap",
}));

const handleQuickConnectClick = (event) => {
  // Send quick connect action to main
  ipcRenderer.send("cli:quick-connect");
};

const handleDisconnectClick = (event) => {
  // Send disconnect action to main
  ipcRenderer.send("cli:disconnect");
};

export default function BottomConnectPaper({ connectedServer }) {
  return (
    <Paper
      elevation={6}
      sx={{
        width: "30%",
        minWidth: "500px",
        position: "fixed",
        bottom: 50,
        left: "40%",
      }}>
      <Box
        sx={{
          textAlign: "",
          height: 100,
          lineHeight: "100px",
          backgroundColor: "primary.dark",
        }}>
        <Container>
          <Grid container>
            <Grid item xs={8}>
              {connectedServer ? connectedServer.status : "Disconnected"}
            </Grid>
            <Grid item xs={4}>
              {connectedServer ? (
                <DisconnectButton
                  variant="contained"
                  color="error"
                  onClick={handleDisconnectClick}>
                  Disconnect
                </DisconnectButton>
              ) : (
                <ConnectButton
                  variant="contained"
                  color="success"
                  onClick={handleQuickConnectClick}>
                  Quick Connect
                </ConnectButton>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Paper>
  );
}
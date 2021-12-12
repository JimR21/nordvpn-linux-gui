import { Button, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import { ipcRenderer } from "electron";
import React from "react";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";

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
        borderRadius: "20px",
      }}>
      <Box
        sx={{
          textAlign: "",
          height: 100,
          lineHeight: "100px",
          backgroundColor: "primary.dark",
          borderRadius: "20px",
          border: connectedServer ? "2px solid #4caf50" : "2px solid #f44336",
        }}>
        <Container>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start">
            <Grid item xs={8}>
              {connectedServer ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}>
                  <LockTwoToneIcon sx={{ color: "#4caf50" }} /> Connected to{" "}
                  {connectedServer.country}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}>
                  <LockOpenTwoToneIcon sx={{ color: "#f44336" }} /> Disconnected
                </div>
              )}
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

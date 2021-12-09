import { Button, Container, Grid, Paper } from "@mui/material";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import React from "react";

const ConnectButton = styled(Button)(({ theme }) => ({
  color: "white",
  whiteSpace: "nowrap",
}));

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
          height: 60,
          lineHeight: "60px",
          backgroundColor: "primary.dark",
        }}>
        <Container>
          <Grid container>
            <Grid item xs={8}>
              {connectedServer ? connectedServer.status : "Disconnected"}
            </Grid>
            <Grid item xs={4}>
              <ConnectButton variant="contained" color="success">
                Quick Connect
              </ConnectButton>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Paper>
  );
}

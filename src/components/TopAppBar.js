import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ipcRenderer } from "electron";

export default function TopAppBar({ logoutAction }) {
  const handleLogoutClick = (event) => {
    // Send credentials to main
    ipcRenderer.send("cli:logout");
    logoutAction(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#192231" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NordVPN
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogoutClick}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

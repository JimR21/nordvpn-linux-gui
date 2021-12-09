import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import MainWindow from "./MainWindow";
import ServersList from "./ServersList";
import TopAppBar from "./TopAppBar";

const Dashboard = () => {
  const [connectedServer, setConnectedServer] = useState(false);

  useEffect(() => {
    ipcRenderer.on("cli:status", (e, status) => {
      setConnectedServer(status);
    });
  }, []);

  return (
    <div>
      <div style={{ width: "100%", marginBottom: 10 }}>
        <TopAppBar />
      </div>
      <div>
        <Box
          sx={{
            width: "100%",
          }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <ServersList />
            </Grid>
            <Grid item xs={9}>
              <MainWindow connectedServer={connectedServer} />
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;

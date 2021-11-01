import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import ServersList from "./ServersList";
import TopAppBar from "./TopAppBar";

const Dashboard = () => {
  return (
    <div>
      <div style={{ width: "100%", marginBottom: 10 }}>
        <TopAppBar />
      </div>
      <div>
        <Box
          sx={{
            width: "100%",
            // maxHeight: 600,
            // backgroundColor: "red",
          }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <ServersList />
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;

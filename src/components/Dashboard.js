import { Container } from "@mui/material";
import React from "react";
import TopAppBar from "./TopAppBar";

const Dashboard = ({ loginUpdate }) => {
  return (
    <div style={{ width: "100%" }}>
      <TopAppBar logoutAction={loginUpdate} />
    </div>
  );
};

export default Dashboard;

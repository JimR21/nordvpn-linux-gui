import { Container, Paper } from "@mui/material";
import React from "react";
import BottomConnectPaper from "./BottomConnectPaper";

function MainWindow({ connectedServer }) {
  return (
    <Container>
      <BottomConnectPaper connectedServer={connectedServer} />
    </Container>
  );
}

export default MainWindow;

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import React from "react";

function VpnServerListItem({ server }) {
  return (
    <ListItemButton>
      <ListItemIcon>
        <PublicIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary={server.domain} />
    </ListItemButton>
  );
}

export default VpnServerListItem;

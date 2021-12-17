import PublicIcon from "@mui/icons-material/Public";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";

function VpnServerListItem({ server }) {
  return (
    <ListItemButton id={server.domain}>
      <ListItemIcon>
        <PublicIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText
        primary={server.domain}
        secondary={`Load: ${server.load}%`}
      />
    </ListItemButton>
  );
}

export default VpnServerListItem;

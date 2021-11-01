import ExpandMore from "@mui/icons-material/ExpandMore";
import PublicIcon from "@mui/icons-material/Public";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { CountryServerGroup } from "./CountryServerGroup";

export default function ServersList() {
  const [open, setOpen] = useState(true);
  const [serversByCountry, setServersByCountry] = useState([]);

  useEffect(() => {
    console.log("Requesting servers");

    // Request nord servers from main
    ipcRenderer.send("api:fetch-servers");

    // Get servers grouped by country and sorted by load from main
    ipcRenderer.on(
      "servers:grouped-by-country-order-by-load-asc",
      (e, servers) => {
        console.log("Got servers in UI");
        console.log(servers);
        setServersByCountry(servers);
      }
    );
    return () => {};
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const countryGroups = (servers) => {
    let countryGroups = [];
    for (const country in servers) {
      let countryGroup = servers[country];
      countryGroups.push(
        <CountryServerGroup key={country} countryGroup={countryGroup} />
      );
    }
    return countryGroups;
  };

  return <div>{countryGroups(serversByCountry)}</div>;
}

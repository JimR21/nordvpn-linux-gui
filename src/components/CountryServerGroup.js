import ExpandMore from "@mui/icons-material/ExpandMore";
import LockTwoTone from "@mui/icons-material/LockTwoTone";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  List,
  Typography,
} from "@mui/material";
import { styled } from "@mui/styles";
import { ipcRenderer } from "electron";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import VpnServerListItem from "./VpnServerListItem";

const handleConnectClick = (event) => {
  event.stopPropagation();
  console.log(event.currentTarget.id);
  // Send disconnect action to main
  ipcRenderer.send("cli:connect", event.currentTarget.id);
};

export const CountryServerGroup = ({ countryGroup, connectedServer }) => {
  const vpnServerListItem = (countryGroup) => {
    const listItems = [];
    countryGroup.forEach((server) => {
      listItems.push(
        <VpnServerListItem
          key={server.id}
          server={server}
          isConnected={server.id == connectedServer.server}
        />
      );
    });
    return listItems;
  };

  const CustomAccordion = styled((props) => (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      disableGutters
      elevation={0}
      square
      {...props}
    />
  ))(({ theme }) => ({}));

  const CustomAccordionSummary = styled((props) => (
    <AccordionSummary {...props} />
  ))(({ theme }) => ({
    "flexDirection": "row-reverse",
    "& .MuiAccordionSummary-content": {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
  }));

  return (
    <div>
      <CustomAccordion>
        <CustomAccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
          aria-controls="panelus-content"
          id="panelus-header">
          <Grid container>
            <Grid item xs={3}>
              <ReactCountryFlag
                countryCode={countryGroup[0].flag}
                style={{
                  fontSize: "1.3em",
                }}
                aria-label={countryGroup[0].country}
              />
            </Grid>
            <Grid item xs={7}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: 15,
                  fontWeight: "medium",
                }}>
                {countryGroup[0].country}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Button
                id={countryGroup[0].flag}
                size="small"
                variant="outlined"
                color={
                  countryGroup[0].country == connectedServer.country
                    ? "success"
                    : "error"
                }
                onClick={handleConnectClick}>
                <LockTwoTone />
              </Button>
            </Grid>
          </Grid>
        </CustomAccordionSummary>
        <AccordionDetails>
          <List component="div" disablePadding>
            {vpnServerListItem(countryGroup)}
          </List>
        </AccordionDetails>
      </CustomAccordion>
    </div>
  );
};

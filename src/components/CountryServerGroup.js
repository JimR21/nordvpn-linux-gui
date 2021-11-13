import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  List,
  Typography,
} from "@mui/material";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import VpnServerListItem from "./VpnServerListItem";

export const CountryServerGroup = ({ countryGroup }) => {
  const vpnServerListItem = (countryGroup) => {
    const listItems = [];
    countryGroup.forEach((server) => {
      listItems.push(<VpnServerListItem key={server.id} server={server} />);
    });
    return listItems;
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
          aria-controls="panelus-content"
          id="panelus-header">
          <Grid container>
            <Grid item xs={3}>
              <ReactCountryFlag
                countryCode={countryGroup[0].flag}
                style={{
                  fontSize: "1em",
                }}
                aria-label={countryGroup[0].country}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography>{countryGroup[0].country}</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <List component="div" disablePadding>
            {vpnServerListItem(countryGroup)}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

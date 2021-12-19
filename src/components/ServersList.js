import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { CountryServerGroup } from "./CountryServerGroup";

export default function ServersList({ connectedServer }) {
  const [open, setOpen] = useState(true);
  const [serversByCountry, setServersByCountry] = useState([]);

  useEffect(() => {
    // Request nord servers from main
    ipcRenderer.send("api:fetch-servers");

    // Get servers grouped by country and sorted by load from main
    ipcRenderer.on(
      "servers:grouped-by-country-order-by-load-asc",
      (e, servers) => {
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
        <CountryServerGroup
          key={country}
          countryGroup={countryGroup}
          connectedServer={connectedServer}
        />
      );
    }
    return countryGroups;
  };

  return <div>{countryGroups(serversByCountry)}</div>;
}

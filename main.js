const path = require("path");
const url = require("url");
const fetch = require("electron-fetch").default;
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const child_process = require("child_process");
const groupBy = require("json-groupby");

let mainWindow;

let isDev = false;

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1400 : 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

/* IPC listeners */
ipcMain.on("cli:is-logged-in", sendLoggedIn);

ipcMain.on("cli:login", (e, credentials) => {
  sendLoginResult(credentials.email, credentials.password);
});

ipcMain.on("cli:logout", sendLogoutResult);

// Send to window if user is logged in
function sendLoggedIn() {
  cliLogin((output) => {
    mainWindow.webContents.send(
      "cli:logged-in",
      output.includes("You are already logged in.")
    );
  });
}

// Send login result to window
function sendLoginResult(email, password) {
  cliLoginWithCredentials(email, password, (output) => {
    console.log(`Checking credentials: ${output}`);
    if (output.includes("Username or password is not correct.")) {
      mainWindow.webContents.send(
        "cli:login-error",
        "Username or password is not correct. Please try again."
      );
    } else if (output.includes("Welcome to NordVPN!")) {
      mainWindow.webContents.send("cli:logged-in", true);
    } else if (output.includes("We're having trouble reaching our servers.")) {
      mainWindow.webContents.send(
        "cli:login-error",
        "NordVPN CLI: We're having trouble reaching our servers."
      );
    } else {
      console.error(
        `Login with credentials returned unknown output: ${output}`
      );
    }
  });
}

// Send logout result to window
function sendLogoutResult() {
  cliLogout((output) => {
    if (output.includes("You are logged out.")) {
      console.log("Logged out successfully");
      mainWindow.webContents.send("cli:logged-in", false);
    } else {
      console.error(`Error while attempting to logout. Output: ${output}`);
    }
  });
}

// API listeners
ipcMain.on("api:fetch-servers", handleFetchServers);

function handleFetchServers() {
  // Dummy data
  servers = [
    {
      id: 590778,
      ip_address: "209.58.133.169",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #355",
      domain: "us355.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 37.769813499999998,
        long: -122.46600050000001,
      },
      load: 40,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590779,
      ip_address: "209.58.133.170",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #356",
      domain: "us356.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 37.769813499999998,
        long: -122.46600050000001,
      },
      load: 64,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590774,
      ip_address: "162.210.198.131",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #351",
      domain: "us351.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 38.750833299999996,
        long: -77.475555600000007,
      },
      load: 43,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: false,
        proxy_ssl_cybersec: false,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590775,
      ip_address: "162.210.198.132",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #352",
      domain: "us352.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 38.750833299999996,
        long: -77.475555600000007,
      },
      load: 26,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: false,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590776,
      ip_address: "209.58.133.167",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #353",
      domain: "us353.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 37.769813499999998,
        long: -122.46600050000001,
      },
      load: 68,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590777,
      ip_address: "209.58.133.168",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #354",
      domain: "us354.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 37.769813499999998,
        long: -122.46600050000001,
      },
      load: 31,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590778,
      ip_address: "209.58.133.169",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #355",
      domain: "us355.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 37.769813499999998,
        long: -122.46600050000001,
      },
      load: 40,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 590779,
      ip_address: "209.58.133.170",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #356",
      domain: "us356.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 37.769813499999998,
        long: -122.46600050000001,
      },
      load: 64,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 618584,
      ip_address: "209.58.144.227",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #5032",
      domain: "us5032.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 32.783333300000002,
        long: -96.799999999999997,
      },
      load: 60,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: false,
        proxy: false,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: false,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 727767,
      ip_address: "181.215.110.136",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #502",
      domain: "us502.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 41.850000000000001,
        long: -87.650000000000006,
      },
      load: 80,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 727769,
      ip_address: "181.215.110.137",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #503",
      domain: "us503.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 41.850000000000001,
        long: -87.650000000000006,
      },
      load: 100,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 727771,
      ip_address: "181.215.110.138",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #504",
      domain: "us504.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 41.850000000000001,
        long: -87.650000000000006,
      },
      load: 27,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 727773,
      ip_address: "181.215.110.139",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #505",
      domain: "us505.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 41.850000000000001,
        long: -87.650000000000006,
      },
      load: 52,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 727787,
      ip_address: "181.215.110.148",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "United States #5036",
      domain: "us5036.nordvpn.com",
      price: 0,
      flag: "US",
      country: "United States",
      location: {
        lat: 41.850000000000001,
        long: -87.650000000000006,
      },
      load: 60,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: false,
        proxy: false,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: false,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 727871,
      ip_address: "185.38.150.116",
      search_keywords: [],
      categories: [
        {
          name: "Standard VPN servers",
        },
      ],
      name: "United Kingdom #73",
      domain: "uk73.nordvpn.com",
      price: 0,
      flag: "GB",
      country: "United Kingdom",
      location: {
        lat: 51.514125,
        long: -0.093688999999999995,
      },
      load: 60,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 920769,
      ip_address: "196.196.244.3",
      search_keywords: ["sha512", "P2P"],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "Sweden #60",
      domain: "se60.nordvpn.com",
      price: 0,
      flag: "SE",
      country: "Sweden",
      location: {
        lat: 59.333333000000003,
        long: 18.050000000000001,
      },
      load: 29,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 920771,
      ip_address: "196.196.244.4",
      search_keywords: ["sha512", "P2P"],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "Sweden #61",
      domain: "se61.nordvpn.com",
      price: 0,
      flag: "SE",
      country: "Sweden",
      location: {
        lat: 59.333333000000003,
        long: 18.050000000000001,
      },
      load: 28,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
    {
      id: 920773,
      ip_address: "196.196.244.5",
      search_keywords: ["sha512", "P2P"],
      categories: [
        {
          name: "Standard VPN servers",
        },
        {
          name: "P2P",
        },
      ],
      name: "Sweden #62",
      domain: "se62.nordvpn.com",
      price: 0,
      flag: "SE",
      country: "Sweden",
      location: {
        lat: 59.333333000000003,
        long: 18.050000000000001,
      },
      load: 31,
      features: {
        ikev2: true,
        openvpn_udp: true,
        openvpn_tcp: true,
        socks: true,
        proxy: true,
        pptp: false,
        l2tp: false,
        openvpn_xor_udp: false,
        openvpn_xor_tcp: false,
        proxy_cybersec: true,
        proxy_ssl: true,
        proxy_ssl_cybersec: true,
        ikev2_v6: false,
        openvpn_udp_v6: false,
        openvpn_tcp_v6: false,
        wireguard_udp: false,
        openvpn_udp_tls_crypt: false,
        openvpn_tcp_tls_crypt: false,
        openvpn_dedicated_udp: false,
        openvpn_dedicated_tcp: false,
        v2ray: false,
      },
    },
  ];

  // Sort servers by ascending load
  servers.sort(sortByLoad);

  // Group by country
  let serversByCountry = groupBy(servers, ["country"]);
  console.log(serversByCountry);

  sendServers(serversByCountry);

  for (const country in servers) {
    console.log(`${country}: ${servers[country]}`);
  }

  // ascending order
  function sortByLoad(x, y) {
    return x.load - y.load;
  }

  // fetchServers((servers) => {
  //   sendServers(servers);
  // });
}

function sendServers(servers) {
  console.log("Sending servers");
  mainWindow.webContents.send(
    "servers:grouped-by-country-order-by-load-asc",
    servers
  );
}

/* NordVPN CLI commands */
function cliLogin(callback) {
  execute("nordvpn login", callback);
}

function cliLoginWithCredentials(email, password, callback) {
  execute(`nordvpn login -u ${email} -p ${password}`, callback);
}

function cliLogout(callback) {
  execute("nordvpn logout", callback);
}

/* Nord API calls */
const apiUrl = "https://api.nordvpn.com/server";

function fetchServers(callback) {
  console.log("fetching servers...");
  fetch("https://api.nordvpn.com/server")
    .then((response) => response.json())
    .then((data) => callback(data));
}

// This function will output the lines from the script
// and will return the full combined output
// as well as exit code when it's done (using the callback).
function run_command(command, args, callback) {
  var child = child_process.spawn(command, args, {
    encoding: "utf8",
    shell: true,
  });
  // You can also use a variable to save the output for when the script closes later
  child.on("error", (error) => {
    error.log(`Error occurred while running command ${command}`);
  });

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    //Here is the output
    data = data.toString();
    callback(data);
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (data) => {
    // Return some data to the renderer process with the mainprocess-response ID
    mainWindow.webContents.send("mainprocess-response", data);
    //Here is the output from the command
    error.log(data);
  });

  child.on("close", (code) => {
    //Here you can get the exit code of the script
    console.log(`Command ${command} exited with code ${code}`);
  });
}

function execute(command, callback) {
  child_process.exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}

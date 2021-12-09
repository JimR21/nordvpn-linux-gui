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
    minWidth: 1000,
    minHeight: 700,
    show: false,
    icon: `${__dirname}/assets/nord-icon-152x152.png`,
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
        console.error("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }

    // Start sending checking the VPN status
    setInterval(() => {
      console.log("Checking status");
      sendUpdatedVpnStatus();
    }, 5000);
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
      mainWindow.webContents.send("cli:logged-in", false);
    } else {
      console.error(`Error while attempting to logout. Output: ${output}`);
    }
  });
}

// API listeners
ipcMain.on("api:fetch-servers", handleFetchServers);

function handleFetchServers() {
  fetchServers((servers) => {
    // Sort servers by ascending load
    servers.sort(sortByLoad);

    // Group by country
    let serversByCountry = groupBy(servers, ["country"]);
    sendServers(serversByCountry);
  });

  // ascending order
  function sortByLoad(x, y) {
    return x.load - y.load;
  }
}

function sendServers(servers) {
  mainWindow.webContents.send(
    "servers:grouped-by-country-order-by-load-asc",
    servers
  );
}

let currentVpnStatus = false;

// Send VPN status result to window
function sendUpdatedVpnStatus() {
  cliStatus((output) => {
    console.log(output);
    if (output.includes("Disconnected")) {
      // Send only if the status was previously connected
      if (currentVpnStatus) {
        console.log("Sending disconnected");
        mainWindow.webContents.send("cli:status", false);
        currentVpnStatus = false;
      }
    } else {
      let regex =
        /Status: (.+?)\nCurrent server: (.+?)\nCountry: (.+?)\nCity: (.+?)\nServer IP: (.+?)\nCurrent technology: (.+?)\nCurrent protocol: (.+?)\n/gm;
      let match = regex.exec(output);
      if (match == null || match.length != 8) {
        console.error(
          `Error while attempting to get the VPN status. Output: ${output}`
        );
      }
      let newVpnStatus = new ServerStatus(match);
      // Send only if it's a connection to a new server
      if (
        newVpnStatus.status == "Connected" &&
        (!currentVpnStatus || currentVpnStatus.server != newVpnStatus.server)
      ) {
        console.log("Sending connected");
        mainWindow.webContents.send("cli:status", new ServerStatus(match));
        currentVpnStatus = newVpnStatus;
      }
    }
  });
}

class ServerStatus {
  constructor(match) {
    this.status = match[1];
    this.server = match[2];
    this.country = match[3];
    this.city = match[4];
    this.serverIp = match[5];
    this.technology = match[6];
    this.protocol = match[7];

    //add in this object's "type" in a place
    //that is unlikely to exist in other JSON strings
    this.__type = "ServerStatus";
  }
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

function cliStatus(callback) {
  execute("nordvpn status", callback);
}

/* Nord API calls */
const apiUrl = "https://api.nordvpn.com/server";

function fetchServers(callback) {
  fetch("https://api.nordvpn.com/server")
    .then((response) => response.json())
    .then((data) => callback(data));
}

function execute(command, callback) {
  child_process.exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}

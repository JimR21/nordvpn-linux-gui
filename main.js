const path = require("path");
const url = require("url");
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const child_process = require("child_process");

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

ipcMain.on("cli:credentials", (e, credentials) => {
  console.log(credentials);
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
      // mainWindow.webContents.send("cli:is-logged-in", false);
      console.log("Logged out successfully");
    } else {
      console.error(`Error while attempting to logout. Output: ${output}`);
    }
  });
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

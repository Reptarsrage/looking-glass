const Log = require("electron-log");

Log.transports.console.useStyles = true;
Log.transports.console.level = "info";

module.exports = Log;

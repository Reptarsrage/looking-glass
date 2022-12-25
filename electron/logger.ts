import Log from 'electron-log';

Log.transports.console.useStyles = true;
Log.transports.console.level = 'info';

export default Log;

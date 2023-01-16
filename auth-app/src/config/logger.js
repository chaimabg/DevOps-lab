const { createLogger, format, transports } = require("winston");
const { combine, splat, timestamp, printf } = format;
const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };

const logger = createLogger({
    levels: logLevels,
    format: format.json(),
    formatter: (options) =>
        `${options.meta.Client_IP}-${options.meta.timestamp}-${options.meta.REQ_ID}-${options.level}: ${options.message}`,
    transports: [new transports.Console()],
});
module.exports=logger;
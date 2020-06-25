// Instead of console.log, a mature logger likes winston can speed up error discovery and understanding
// For simplicity, here I just transport all logs to console
// In a larger project, depends on log level and environment, we can transport them to log files, slack, webhook, etc

const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
})

logger.infoStream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}

module.exports = logger

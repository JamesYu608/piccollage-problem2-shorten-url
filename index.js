// This is the entry point of the server
// I separate express app and server so it's easier for testing routes instead of starting the real server
// (e.g. supertest, https://www.npmjs.com/package/supertest)

const { PORT } = require('./config')
const app = require('./src')
const logger = require('./src/utils/logger')
const AppError = require('./src/utils/AppError')

app.listen(PORT, () => logger.info(`Shorten URL service is listening on port ${PORT}!`))

// Catching unresolved and rejected promises
process.on('unhandledRejection', (reason) => {
  // throw and handle it in uncaughtException
  throw reason
})
process.on('uncaughtException', (error) => {
  const appError = AppError.handler(error)
  if (!appError.isOperational) {
    // do something to gracefully restart the service
    process.exit(1)
  }
})

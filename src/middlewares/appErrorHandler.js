// This middleware is used to handle all app errors
// No matter where the errors come from, we only handle and build response here

const AppError = require('../utils/AppError')

function appErrorHandler (err, req, res, next) {
  const appError = AppError.handler(err)
  if (appError.isOperational) {
    // Known issue, just return error response to user
    res.status(appError.code)
      .json({
        code: appError.code,
        message: appError.message
      })
  } else {
    // [DANGEROUS] Unknown issue occurred!
    // it might lead to an unpredicted behavior if we keep the service running

    // do something to gracefully restart the service
    process.exit(1)
  }
}

module.exports = appErrorHandler

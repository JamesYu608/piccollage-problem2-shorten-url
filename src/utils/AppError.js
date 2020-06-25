// This is our customized error class which extends built-in error class
// So we can distinguish app errors (expected) and other errors (unexpected)
// Besides, rather than arbitrarily create errors everywhere, we extract common errors and create them in the same way

const logger = require('./logger')

class AppError extends Error {
  constructor (name, code, message, logMessage = 'No additional information', isOperational = true) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    this.name = name
    this.code = code
    this.message = message || name
    this.logMessage = logMessage
    this.isOperational = isOperational
  }

  // Common Errors:
  static badRequest (message, logMessage) {
    return new AppError('Bad request', 400, message, logMessage)
  }

  static notFound (message, logMessage) {
    return new AppError('Not found', 404, message, logMessage)
  }

  static badImplementation (message = 'An internal server error occurred', logMessage = '') {
    return new AppError('Bad implementation', 500, message, logMessage)
  }

  // Handle error (e.g. logging), return AppError instance (wrap unknown error if needed)
  static handler (error) {
    // Errors thrown by system
    if (!(error instanceof AppError)) {
      // Case 1: Errors we know and we can handle
      if (error.name === 'SyntaxError') {
        error = AppError.badRequest('Syntax Error!')
      } else {
        // Case 2:[DANGEROUS] Unknown error, wrap this error in AppError instance and set the flag "isOperational" to false
        error = new AppError(error.name, error.message, 'Unknown error', error.toString(), false)
      }
    }

    // Build log message from error to help us for troubleshooting
    const logMessage = {
      error: {
        name: error.name,
        code: error.code,
        message: error.message,
        logMessage: error.logMessage,
        isOperational: error.isOperational
      }
    }

    if (!error.isOperational) {
      logger.error(logMessage)
    } else if (error.code >= 500) {
      logger.warn(logMessage)
    } else {
      logger.info(logMessage)
    }

    return error
  }
}

module.exports = AppError

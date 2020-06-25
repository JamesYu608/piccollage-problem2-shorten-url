// This middleware is used to validate the request content
// If it's invalid, we can early return 400 error to client

const Ajv = require('ajv')
const AppError = require('../utils/AppError')

function validator (schema) {
  return (req, res, next) => {
    const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })
    if (schema.query) validate(schema.query, req.query)
    if (schema.body) validate(schema.body, req.body)
    next()

    function validate (schema, target) {
      const validate = ajv.compile(schema)
      if (!validate(target)) {
        throw AppError.badRequest(validate.errors.map(e => e.message).join('\n'))
      }
    }
  }
}

module.exports = validator

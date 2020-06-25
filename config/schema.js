// This file is used to validate our config is setup properly when service is starting
// To make sure that there are no missing environment variables at runtime

const Ajv = require('ajv')

const schema = {
  type: 'object',
  properties: {
    PORT: { type: 'number' }
  },
  required: ['PORT']
}

const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })
const validate = ajv.compile(schema)

module.exports = {
  validate
}

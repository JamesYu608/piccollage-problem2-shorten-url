// This file is used to validate our config is setup properly when service is starting
// To make sure that there are no missing environment variables at runtime

const Ajv = require('ajv')

const rdsSchema = {
  type: 'object',
  properties: {
    CLIENT: { type: 'string' },
    DATABASE: { type: 'string' },
    USER: { type: 'string' },
    PASSWORD: { type: 'string' },
    HOST: { type: 'string' }
  },
  required: ['CLIENT', 'DATABASE', 'USER', 'PASSWORD', 'HOST']
}

const schema = {
  type: 'object',
  properties: {
    PORT: { type: 'number' },
    SERVER_ADDRESS: { type: 'string' },
    shortenConfig: {
      type: 'object',
      properties: {
        SHORTENED_PATH_SPACE: { type: 'string' },
        SHORTENED_PATH_LENGTH: { type: 'number' },
        MAX_RETRY_SHORTEN_COUNT: { type: 'number' },
      },
      required: ['SHORTENED_PATH_SPACE', 'SHORTENED_PATH_LENGTH', 'MAX_RETRY_SHORTEN_COUNT']
    },
    repositories: {
      type: 'object',
      properties: {
        rds: rdsSchema,
      },
      required: ['rds']
    }
  },
  required: ['PORT', 'SERVER_ADDRESS', 'shortenConfig', 'repositories']
}

const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })
const validate = ajv.compile(schema)

module.exports = {
  validate
}

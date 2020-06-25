// All service config is here, including database config, 3rd-party API URLs, credentials, etc.
// Generally, they will be setup at runtime or written in .env file, then loaded by a config library likes dotenv
// But in this demo project, they are HARDCODE here so I don't have to provide another "secret" file :D

const { validate } = require('./schema')

const config = {
  PORT: 8080,
  SERVER_ADDRESS: 'http://localhost:8080',
  shortenConfig: {
    SHORTENED_PATH_SPACE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // Base62
    SHORTENED_PATH_LENGTH: 2,
    MAX_RETRY_SHORTEN_COUNT: 50
  },
  repositories: {
    rds: {
      CLIENT: 'mysql',
      DATABASE: 'demo',
      USER: 'root',
      PASSWORD: 'docker',
      HOST: 'localhost'
    }
  }
}

if (!validate(config)) {
  const errorMessage = validate.errors.map(e => e.message).join('\n')
  throw new Error(errorMessage)
}

module.exports = config

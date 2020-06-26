const config = require('./jest.config')

config.testRegex = '.unit.test.js'
config.setupFilesAfterEnv = [] // Don't have to call setup files in unit testing

module.exports = config

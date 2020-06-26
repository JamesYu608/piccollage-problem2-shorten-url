module.exports = {
  bail: true,
  verbose: true,
  setupFilesAfterEnv: ['./integrationSetup'],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/test/'
  ]
}

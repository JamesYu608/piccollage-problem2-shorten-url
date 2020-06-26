const repositories = require('./src/repositories')

afterAll(async () => {
  await repositories.shutDown()
})

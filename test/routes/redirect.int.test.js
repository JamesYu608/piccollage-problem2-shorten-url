const request = require('supertest')
const app = require('../../src')
const { createAndSaveUrlPair } = require('../testUtil')

describe('[Integration][Route][GET] /:shortenedPath', () => {
  test('urlPair is exist, response should be 301, check database and compare with response', async () => {
    // Arrange
    const data = {
      shortenedPath: 'redirect_1',
      originalUrl: 'http://redirect.int.test/urlPair/is/exist'
    }
    await createAndSaveUrlPair(data)

    // Act & Assert
    await request(app)
      .get(`/${data.shortenedPath}`)
      .expect(301)
      .expect('Location', data.originalUrl)
  })

  test('urlPair does not exist, response should be 404', async () => {
    await request(app)
      .get('/no_this_shortened_path')
      .expect(404)
  })
})

const request = require('supertest')
const app = require('../../src')
const { createAndSaveUrlPair, parseShortenedPath, urlPairDAL } = require('../testUtil')

describe('[Integration][Route][POST] /shorten', () => {
  test('Shorten a new url, after response, check database and compare with response', async () => {
    // Arrange
    const originalUrl = 'http://shorten.int.test/shorten/a/new/url'

    // Act
    const { body: result } = await request(app)
      .post('/shorten')
      .send({ originalUrl })
      .expect(200)

    // Assert
    expect(result).toHaveProperty('shortenedUrl')
    const shortenedPath = parseShortenedPath(result.shortenedUrl)
    const urlPairFromDB = await urlPairDAL.getByShortenedPath(shortenedPath)
    expect(urlPairFromDB.originalUrl).toBe(originalUrl)
  })

  test('Shorten an existing url, compare response with database', async () => {
    // Arrange
    const data = {
      shortenedPath: 'shorten_1',
      originalUrl: 'http://shorten.int.test/shorten/an/existing/url'
    }
    await createAndSaveUrlPair(data)

    // Act
    const { body: result } = await request(app)
      .post('/shorten')
      .send({ originalUrl: data.originalUrl })
      .expect(200)

    // Assert
    expect(result).toHaveProperty('shortenedUrl')
    const shortenedPath = parseShortenedPath(result.shortenedUrl)
    expect(shortenedPath).toBe(data.shortenedPath)
  })

  test('Required field originalUrl is missing, response should be 400', async () => {
    await request(app)
      .post('/shorten')
      .expect(400)
  })

  test('Field originalUrl is not a valid url, response should be 400', async () => {
    await request(app)
      .post('/shorten')
      .send({ originalUrl: 'abc' })
      .expect(400)
  })
})

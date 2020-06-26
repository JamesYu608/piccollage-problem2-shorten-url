const UrlPair = require('../../../src/components/urlPairs/UrlPair')
const UrlPairCache = require('../../../src/components/urlPairs/UrlPairCache')
const { redis: cache } = require('../../../src/repositories')

const urlPairCache = new UrlPairCache(cache)

// Same as UrlPairCache
const KEY_SHORTENED_PATH = 'SHORTENED_PATH'
const KEY_ORIGINAL_URL = 'ORIGINAL_URL'

describe('[Integration][Component] UrlPairCache', () => {
  describe('[Function] set', () => {
    test('set a urlPair to cache, then check data exist in cache', async () => {
      // Arrange
      const urlPair = new UrlPair('set_urlPair', 'http://UrlPairCache.int.test/set/a/urlPair')
      const urlPairJSON = JSON.stringify(urlPair)

      // Act
      await urlPairCache.set(urlPair)

      // Assert
      const cache1 = await cache.get(`${KEY_SHORTENED_PATH}_${urlPair.shortenedPath}`)
      expect(cache1).toBe(urlPairJSON)
      const cache2 = await cache.get(`${KEY_ORIGINAL_URL}_${urlPair.originalUrl}`)
      expect(cache2).toBe(urlPairJSON)
    })
  })

  describe('[Function] isShortenedPathExist', () => {
    test('shortenedPath exists, should return true', async () => {
      // Arrange
      const shortenedPath = 'isShortenedPathExist'
      await cache.set(`${KEY_SHORTENED_PATH}_${shortenedPath}`, 'whatever')

      // Act
      const result = await urlPairCache.isShortenedPathExist(shortenedPath)

      // Assert
      expect(result).toBe(true)
    })

    test('shortenedPath does not exist, should return false', async () => {
      // Act
      const result = await urlPairCache.isShortenedPathExist('no_this_shortenedPath')

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('[Function] getByShortenedPath', () => {
    test('shortenedPath exists, should return urlPair', async () => {
      // Arrange
      const urlPair = new UrlPair('getByShortenedPath_exists', 'http://UrlPairCache.int.test/getByShortenedPath_exists')
      await cache.set(`${KEY_SHORTENED_PATH}_${urlPair.shortenedPath}`, JSON.stringify(urlPair))

      // Act
      const result = await urlPairCache.getByShortenedPath(urlPair.shortenedPath)

      // Assert
      expect(result.shortenedPath).toBe(urlPair.shortenedPath)
      expect(result.originalUrl).toBe(urlPair.originalUrl)
    })

    test('shortenedPath does not exist, should return null', async () => {
      // Act
      const result = await urlPairCache.getByShortenedPath('no_this_shortenedPath')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('[Function] getByOriginalUrl', () => {
    test('originalUrl exists, should return urlPair', async () => {
      // Arrange
      const urlPair = new UrlPair('getByOriginalUrl_exists', 'http://UrlPairCache.int.test/getByOriginalUrl_exists')
      await cache.set(`${KEY_ORIGINAL_URL}_${urlPair.originalUrl}`, JSON.stringify(urlPair))

      // Act
      const result = await urlPairCache.getByOriginalUrl(urlPair.originalUrl)

      // Assert
      expect(result.shortenedPath).toBe(urlPair.shortenedPath)
      expect(result.originalUrl).toBe(urlPair.originalUrl)
    })

    test('originalUrl does not exist, should return null', async () => {
      // Act
      const result = await urlPairCache.getByOriginalUrl('no_this_originalUrl')

      // Assert
      expect(result).toBeNull()
    })
  })
})

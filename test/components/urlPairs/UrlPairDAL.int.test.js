const UrlPair = require('../../../src/components/urlPairs/UrlPair')
const UrlPairDAL = require('../../../src/components/urlPairs/UrlPairDAL')
const UrlPairCache = require('../../../src/components/urlPairs/UrlPairCache')
const repositories = require('../../../src/repositories')
const { NAME: TABLE_NAME, columns } = require('../../../src/repositories/urlPairTableSchema')

const urlPairDAL = new UrlPairDAL(repositories)

describe('[Integration][Component] UrlPairDAL', () => {
  describe('[Function] save', () => {
    test('Save a urlPair, check database and compare with urlPair', async () => {
      // Arrange
      const urlPair = new UrlPair('dal_save', 'http://UrlPairDAL.int.test/dal_save')

      // Act
      const result = await urlPairDAL.save(urlPair)

      // Assert
      expect(result).toBe(true)
      const dbResult = await repositories.rds(TABLE_NAME)
        .select(columns.SHORTENED_PATH, columns.ORIGINAL_URL)
        .where(columns.SHORTENED_PATH, urlPair.shortenedPath)
      expect(dbResult[0][columns.SHORTENED_PATH]).toBe(urlPair.shortenedPath)
      expect(dbResult[0][columns.ORIGINAL_URL]).toBe(urlPair.originalUrl)
    })
  })

  describe('[Function] getByOriginalUrl', () => {
    test('originalUrl exists, cache miss, should return urlPair and save to cache', async () => {
      // Arrange
      const cacheSetSpy = jest.spyOn(UrlPairCache.prototype, 'set')
      const data = {
        shortenedPath: 'dal_ori',
        originalUrl: 'http://UrlPairDAL.int.test/dal_ori'
      }
      await repositories.rds(TABLE_NAME)
        .insert({
          [columns.SHORTENED_PATH]: data.shortenedPath,
          [columns.ORIGINAL_URL]: data.originalUrl
        })

      // Act
      const urlPair = await urlPairDAL.getByOriginalUrl(data.originalUrl)

      // Assert
      expect(cacheSetSpy).toBeCalled()
      expect(urlPair.shortenedPath).toBe(data.shortenedPath)
      expect(urlPair.originalUrl).toBe(data.originalUrl)

      cacheSetSpy.mockRestore()
    })

    test('originalUrl exists, cache hit, should return urlPair from cache', async () => {
      // Arrange
      const urlPair = new UrlPair('ori_cache', 'http://UrlPairDAL.int.test/ori_cache')
      const cacheGetByOriginalUrlSpy = jest.spyOn(UrlPairCache.prototype, 'getByOriginalUrl')
        .mockResolvedValue(urlPair)

      // Act
      const result = await urlPairDAL.getByOriginalUrl(urlPair.originalUrl)

      // Assert
      expect(result.shortenedPath).toBe(urlPair.shortenedPath)
      expect(result.originalUrl).toBe(urlPair.originalUrl)

      cacheGetByOriginalUrlSpy.mockRestore()
    })

    test('originalUrl does not exist, should return null', async () => {
      // Act
      const result = await urlPairDAL.getByOriginalUrl('no_this_originalUrl')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('[Function] getByShortenedPath', () => {
    test('shortenedPath exists, should return urlPair', async () => {
      // Arrange
      const data = {
        shortenedPath: 'dal_short',
        originalUrl: 'http://UrlPairDAL.int.test/dal_short'
      }
      await repositories.rds(TABLE_NAME)
        .insert({
          [columns.SHORTENED_PATH]: data.shortenedPath,
          [columns.ORIGINAL_URL]: data.originalUrl
        })

      // Act
      const urlPair = await urlPairDAL.getByShortenedPath(data.shortenedPath)

      // Assert
      expect(urlPair.shortenedPath).toBe(data.shortenedPath)
      expect(urlPair.originalUrl).toBe(data.originalUrl)
    })

    test('shortenedPath does not exist, should return null', async () => {
      // Act
      const result = await urlPairDAL.getByShortenedPath('no_this_shortenedPath')

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('[Function] getUniqueShortenedPath', () => {
    test('first time, shortenedPath exists, should try again', async () => {
      // Arrange
      const isShortenedPathExistSpy = jest.spyOn(UrlPairDAL.prototype, 'isShortenedPathExist')
        .mockResolvedValueOnce(true)
      const getShortenedPathSpy = jest.spyOn(UrlPairDAL, 'getShortenedPath')

      // Act
      await urlPairDAL.getUniqueShortenedPath()

      // Assert
      expect(getShortenedPathSpy.mock.calls.length).toBe(2)

      isShortenedPathExistSpy.mockRestore()
      getShortenedPathSpy.mockRestore()
    })

    test('retry limit exceeded, should throw error', async () => {
      // Arrange
      const isShortenedPathExistSpy = jest.spyOn(UrlPairDAL.prototype, 'isShortenedPathExist')
        .mockResolvedValue(true)

      // Act and Assert
      await expect(urlPairDAL.getUniqueShortenedPath()).rejects.toThrowError()

      isShortenedPathExistSpy.mockRestore()
    })
  })
})

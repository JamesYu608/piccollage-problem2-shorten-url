const {
  SHORTENED_PATH_SPACE,
  SHORTENED_PATH_LENGTH,
  MAX_RETRY_SHORTEN_COUNT
} = require('../../../config').shortenConfig
const { NAME: TABLE_NAME, columns } = require('../../repositories/urlPairTableSchema')
const UrlPair = require('./UrlPair')
const UrlPairCache = require('./UrlPairCache')
const logger = require('../../utils/logger')
const AppError = require('../../utils/AppError')

function getShortenedPath () {
  let result = ''
  const charactersLength = SHORTENED_PATH_SPACE.length
  for (let i = 0; i < SHORTENED_PATH_LENGTH; i++) {
    result += SHORTENED_PATH_SPACE.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class UrlPairDAL {
  constructor (repositories) {
    this.rds = repositories.rds
    this.cache = new UrlPairCache(repositories.redis)
  }

  async save (urlPair) {
    // Save to database
    try {
      await this.rds(TABLE_NAME)
        .insert({
          [columns.SHORTENED_PATH]: urlPair.shortenedPath,
          [columns.ORIGINAL_URL]: urlPair.originalUrl
        })
      return true
    } catch (error) {
      throw AppError.badImplementation(null, `[SQL Error] Save urlPair error: ${error}`)
    }
  }

  async getByOriginalUrl (originalUrl) {
    // Step 1: Query cache, if exists, return cache
    const cacheUrlPair = await this.cache.getByOriginalUrl(originalUrl)
    if (cacheUrlPair) {
      return cacheUrlPair
    }

    try {
      // Step 2: Cache miss, query database
      const result = await this.rds(TABLE_NAME)
        .select(columns.SHORTENED_PATH, columns.ORIGINAL_URL)
        .where(columns.ORIGINAL_URL, originalUrl)

      if (result.length === 0) {
        // Step 3-1: Doesn't exist, return null
        return null
      } else {
        // Step 3-2: Exists, save to cache and return urlPair
        const urlPair = new UrlPair(
          result[0][columns.SHORTENED_PATH],
          result[0][columns.ORIGINAL_URL]
        )
        await this.cache.set(urlPair)
        return urlPair
      }
    } catch (error) {
      throw AppError.badImplementation(null, `[SQL Error] Get urlPair by originalUrl error: ${error}`)
    }
  }

  async getByShortenedPath (shortenedPath) {
    // Step 1: Query cache, if exists, return cache
    const cacheUrlPair = await this.cache.getByShortenedPath(shortenedPath)
    if (cacheUrlPair) {
      return cacheUrlPair
    }

    try {
      // Step 2: Cache miss, query database
      const result = await this.rds(TABLE_NAME)
        .select(columns.SHORTENED_PATH, columns.ORIGINAL_URL)
        .where(columns.SHORTENED_PATH, shortenedPath)

      if (result.length === 0) {
        // Step 3-1: Doesn't exist, return null
        return null
      } else {
        // Step 3-2: Exists, save to cache and return urlPair
        const urlPair = new UrlPair(
          result[0][columns.SHORTENED_PATH],
          result[0][columns.ORIGINAL_URL]
        )
        await this.cache.set(urlPair)
        return urlPair
      }
    } catch (error) {
      throw AppError.badImplementation(null, `[SQL Error] Get urlPair by shortenedPath error: ${error}`)
    }
  }

  async getUniqueShortenedPath () {
    let shortenedPath = ''
    let [retryCount, maxRetryCount] = [0, MAX_RETRY_SHORTEN_COUNT]
    while (retryCount < maxRetryCount) {
      shortenedPath = getShortenedPath()
      const isExist = await this.isShortenedPathExist(shortenedPath)
      if (!isExist) {
        return shortenedPath
      }
      retryCount++
      logger.info(`[Shorten] shortenedPath "${shortenedPath}" exists, retryCount: ${retryCount}`)
    }
    throw AppError.badImplementation(
      null, '[Shorten Failed] getUniqueShortenedPath failed, retry limit exceeded'
    )
  }

  async isShortenedPathExist (shortenedPath) {
    // Step 1: Query cache, if exists, return true
    const isExist = await this.cache.isShortenedPathExist(shortenedPath)
    if (isExist) {
      return true
    }

    try {
      // Step 2: Cache miss, query database
      const result = await this.rds(TABLE_NAME)
        .select(columns.SHORTENED_PATH)
        .where(columns.SHORTENED_PATH, shortenedPath)
      // We don't save result to cache, cache is just a support mechanism here
      return result.length !== 0
    } catch (error) {
      throw AppError.badImplementation(null, `[SQL Error] isShortenedPathExist error: ${error}`)
    }
  }
}

module.exports = UrlPairDAL

const {
  SHORTENED_PATH_SPACE,
  SHORTENED_PATH_LENGTH,
  MAX_RETRY_SHORTEN_COUNT
} = require('../../../config').shortenConfig
const { NAME: TABLE_NAME, columns } = require('../../repositories/urlPairTableSchema')
const UrlPair = require('./UrlPair')
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
  }

  async save (urlPair) {
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
    try {
      const result = await this.rds(TABLE_NAME)
        .select(columns.SHORTENED_PATH, columns.ORIGINAL_URL)
        .where(columns.ORIGINAL_URL, originalUrl)
      if (result.length === 0) {
        return null
      } else {
        return new UrlPair(
          result[0][columns.SHORTENED_PATH],
          result[0][columns.ORIGINAL_URL]
        )
      }
    } catch (error) {
      throw AppError.badImplementation(null, `[SQL Error] Get urlPair by originalUrl error: ${error}`)
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
    }
    throw AppError.badImplementation(
      null, '[Shorten Failed] getUniqueShortenedPath failed, retry limit exceeded'
    )
  }

  async isShortenedPathExist (shortenedPath) {
    try {
      const result = await this.rds(TABLE_NAME)
        .select(columns.SHORTENED_PATH)
        .where(columns.SHORTENED_PATH, shortenedPath)
      return result.length !== 0
    } catch (error) {
      throw AppError.badImplementation(null, `[SQL Error] isShortenedPathExist error: ${error}`)
    }
  }
}

module.exports = UrlPairDAL

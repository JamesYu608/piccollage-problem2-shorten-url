const UrlPair = require('./UrlPair')
const logger = require('../../utils/logger')

const KEY_SHORTENED_PATH = 'SHORTENED_PATH'
const KEY_ORIGINAL_URL = 'ORIGINAL_URL'

class UrlPairCache {
  constructor (cache) {
    this.cache = cache
  }

  async set (urlPair) {
    const data = JSON.stringify(urlPair)
    try {
      await this.cache.set(`${KEY_SHORTENED_PATH}_${urlPair.shortenedPath}`, data)
      await this.cache.set(`${KEY_ORIGINAL_URL}_${urlPair.originalUrl}`, data)
      logger.info(`[UrlPairCache] Save ${data} to cache`)
    } catch (error) {
      logger.warn(`[UrlPairCache Error] Set urlPair error: ${error}`)
    }
  }

  async isShortenedPathExist (shortenedPath) {
    try {
      const isExist = await this.cache.exists(`${KEY_SHORTENED_PATH}_${shortenedPath}`)
      if (isExist) {
        logger.info(`[UrlPairCache] Hit! shortenedPath "${shortenedPath}" exists`)
        return true
      } else {
        return false
      }
    } catch (error) {
      logger.warn(`[UrlPairCache Error] Check if shortenedPath exists error: ${error}`)
    }
  }

  async get (key) {
    try {
      const result = await this.cache.get(key)
      if (result) {
        logger.info('[UrlPairCache] Hit! Get urlPair by cache')
        const data = JSON.parse(result)
        return new UrlPair(data.shortenedPath, data.originalUrl)
      } else {
        return null
      }
    } catch (error) {
      logger.warn(`[UrlPairCache Error] Get urlPair by cache error: ${error}, key: ${key}`)
    }
  }

  async getByShortenedPath (shortenedPath) {
    return this.get(`${KEY_SHORTENED_PATH}_${shortenedPath}`)
  }

  async getByOriginalUrl (originalUrl) {
    return this.get(`${KEY_ORIGINAL_URL}_${originalUrl}`)
  }
}

module.exports = UrlPairCache

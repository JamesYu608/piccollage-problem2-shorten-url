const {
  SHORTENED_PATH_SPACE,
  SHORTENED_PATH_LENGTH,
  MAX_RETRY_SHORTEN_COUNT
} = require('../../../config').shortenConfig

function getShortenedPath () {
  let result = ''
  const charactersLength = SHORTENED_PATH_SPACE.length
  for (let i = 0; i < SHORTENED_PATH_LENGTH; i++) {
    result += SHORTENED_PATH_SPACE.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class UrlPairDAL {
  constructor () {}

  async getUniqueShortenedPath () {
    let shortenedPath = ''
    let [retryCount, maxRetryCount] = [0, MAX_RETRY_SHORTEN_COUNT]
    // TODO: check DB
    // while (retryCount < maxRetryCount) {
    //   // retryCount++
    // }
    // // throw error
    shortenedPath = getShortenedPath()
    return shortenedPath
  }
}

module.exports = UrlPairDAL

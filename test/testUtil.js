const UrlPair = require('../src/components/urlPairs/UrlPair')
const UrlPairDAL = require('../src/components/urlPairs/UrlPairDAL')
const repositories = require('../src/repositories')

const urlPairDAL = new UrlPairDAL(repositories)

async function createAndSaveUrlPair (data = {}) {
  const urlPair = new UrlPair(data.shortenedPath, data.originalUrl)
  await urlPairDAL.save(urlPair)
}

function parseShortenedPath (shortenedUrl) {
  const url = new URL(shortenedUrl)
  return url.pathname.substring(1)
}

module.exports = {
  createAndSaveUrlPair,
  parseShortenedPath,
  urlPairDAL
}

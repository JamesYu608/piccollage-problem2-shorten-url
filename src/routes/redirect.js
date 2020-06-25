// This is the entry point of redirect routes

// Generally, I will put each route's business logic and request schema in another files (e.g. routes/redirect/redirectOriginalUrl.js)
// But there is only one method, so I put it here

const { Router } = require('express')
const repositories = require('../repositories')
const UrlPairDAL = require('../components/urlPairs/UrlPairDAL')
const AppError = require('../utils/AppError')

// Setup routes
const router = Router()
router.get('/:shortenedPath', redirectOriginalUrl)

// Business logic
async function redirectOriginalUrl (req, res) {
  const { shortenedPath } = req.params
  const urlPairDAL = new UrlPairDAL(repositories)
  const urlPair = await urlPairDAL.getByShortenedPath(shortenedPath)
  if (!urlPair) {
    throw AppError.notFound('Shorten url not found!')
  }
  res.redirect(301, urlPair.originalUrl)
}

module.exports = router

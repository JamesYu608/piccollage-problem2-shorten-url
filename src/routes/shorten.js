// This is the entry point of shorten routes

// Generally, I will put each route's business logic and request schema in another files (e.g. routes/shorten/createShorten.js)
// But there is only one method, so I put it here

const { Router } = require('express')
const { SERVER_ADDRESS } = require('../../config')
const requestValidator = require('../middlewares/requestValidator')
const repositories = require('../repositories')
const UrlPair = require('../components/urlPairs/UrlPair')
const UrlPairDAL = require('../components/urlPairs/UrlPairDAL')

// Request schema
const createShortenSchema = {
  body: {
    type: 'object',
    properties: {
      originalUrl: {
        type: 'string',
        example: 'https://www.google.com.tw/'
      }
    },
    required: ['originalUrl']
  }
}

// Setup routes
const router = Router()
router.post('/', requestValidator(createShortenSchema), createShorten)

// Business logic
async function createShorten (req, res) {
  const { originalUrl } = req.body
  const urlPairDAL = new UrlPairDAL(repositories)
  let urlPair = await urlPairDAL.getByOriginalUrl(originalUrl)
  if (!urlPair) {
    const uniqueShortenedPath = await urlPairDAL.getUniqueShortenedPath()
    urlPair = new UrlPair(uniqueShortenedPath, originalUrl)
    await urlPairDAL.save(urlPair)
  }

  res.json({
    shortenedUrl: `${SERVER_ADDRESS}/${urlPair.shortenedPath}`
  })
}

module.exports = router

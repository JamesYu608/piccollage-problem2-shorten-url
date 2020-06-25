// This is the entry point of shorten routes

// Generally, I will put each route's business logic and request schema in another files (e.g. routes/shorten/createShorten.js)
// But there is only one method, so I put it here

const { Router } = require('express')
const requestValidator = require('../middlewares/requestValidator')

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
  res.json({
    shortenedUrl: 'AB'
  })
}

module.exports = router

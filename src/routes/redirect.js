// This is the entry point of redirect routes

// Generally, I will put each route's business logic and request schema in another files (e.g. routes/redirect/redirectOriginalUrl.js)
// But there is only one method, so I put it here

const { Router } = require('express')

// Setup routes
const router = Router()
router.get('/:shortenedPath', redirectOriginalUrl)

// Business logic
async function redirectOriginalUrl (req, res) {
  const { shortenedPath } = req.params
  console.log(`shortenedPath: ${shortenedPath}`)
  res.redirect(301, 'https://www.google.com.tw/')
}

module.exports = router

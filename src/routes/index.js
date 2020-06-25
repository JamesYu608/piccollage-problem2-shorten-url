// This is the entry point of all routes

const { Router } = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('../utils/logger')
const appErrorHandler = require('../middlewares/appErrorHandler')

const router = Router()
// middlewares
router.use(morgan('tiny', { stream: logger.infoStream }))
router.use(bodyParser.json())

// basic routes
router.get('/health', (req, res) => { res.status(200).send() })
router.get('/', (req, res) => res.send('Hello World!'))

// API routes
router.get('/hello', (req, res) => {
  res.json({
    message: 'Hello, PicCollage!'
  })
})

// error handler middlewares
router.use(appErrorHandler)

module.exports = router

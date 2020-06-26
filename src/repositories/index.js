const knex = require('knex')
const Redis = require('ioredis')
const { rds: rdsConfig, redis: redisConfig } = require('../../config').repositories

const rdsConnection = knex({
  client: rdsConfig.CLIENT,
  connection: {
    host: rdsConfig.HOST,
    user: rdsConfig.USER,
    password: rdsConfig.PASSWORD,
    database: rdsConfig.DATABASE
  }
})

const redis = new Redis({
  host: redisConfig.HOST,
  port: redisConfig.PORT,
  retryStrategy (times) {
    return Math.min(times * 100, 3000)
  },
  maxRetriesPerRequest: null
})

// for integration test
async function shutDown () {
  await redis.flushdb()
  await redis.quit()
  await rdsConnection.destroy()
}

module.exports = {
  rds: rdsConnection,
  redis,
  shutDown
}

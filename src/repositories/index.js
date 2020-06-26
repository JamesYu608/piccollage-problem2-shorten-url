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

module.exports = {
  rds: rdsConnection,
  redis
}

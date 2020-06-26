/**
 * This config is used to do migration in test environment
 * It should connect to mysql database in docker-compose.yml
 */

module.exports = {
  client: 'mysql',
  connection: {
    database: 'demo',
    user: 'root',
    password: 'docker',
    host: 'localhost'
  }
}

const tables = [
  'tbl_url_pair'
]

exports.seed = async (knex) => {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0;')
  for (const table of tables) {
    await knex(table).truncate()
  }
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1;')
}

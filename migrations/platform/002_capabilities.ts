import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('capabilities', table => {
    table.uuid('id').primary()
    table.string('capability_key').unique().notNullable()
    table.string('name').notNullable()
    table.jsonb('dependencies').defaultTo('[]')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('capabilities')
}

import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('vendors', table => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('country').notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('vendors')
}

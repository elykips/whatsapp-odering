import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('sessions', table => {
    table.uuid('id').primary()
    table.uuid('vendor_id').notNullable()
    table.string('customer_phone').notNullable()
    table.jsonb('context').defaultTo('{}')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('sessions')
}

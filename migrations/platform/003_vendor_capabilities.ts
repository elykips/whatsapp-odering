import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('vendor_capabilities', table => {
    table.uuid('id').primary()
    table.uuid('vendor_id').references('vendors.id').onDelete('CASCADE')
    table.string('capability_key').notNullable()
    table.boolean('enabled').defaultTo(true)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('vendor_capabilities')
}

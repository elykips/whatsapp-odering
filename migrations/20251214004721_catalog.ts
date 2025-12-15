import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('catalog_items', table => {
    table.uuid('id').primary()
    table.uuid('vendor_id').notNullable()
    table.string('name').notNullable()
    table.text('description')
    table.integer('price').notNullable() // cents
    table.string('currency').defaultTo('KES')
    table.boolean('active').defaultTo(true)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('catalog_items')
}

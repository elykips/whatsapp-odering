import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('order_items', table => {
    table.uuid('id').primary()
    table.uuid('order_id').references('orders.id').onDelete('CASCADE')
    table.uuid('catalog_item_id').notNullable()
    table.integer('quantity').notNullable()
    table.integer('price').notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('order_items')
}

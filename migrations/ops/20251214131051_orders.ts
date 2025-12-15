import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('orders', table => {
    table.uuid('id').primary()
    table.uuid('vendor_id').notNullable()
    table.string('customer_phone').notNullable()
    table.enum('status', [
      'DRAFT',
      'CONFIRMED',
      'PAID',
      'CANCELLED'
    ]).notNullable()
    table.integer('total').notNullable().defaultTo(0)
    table.timestamps(true, true)
  })

  await knex.schema.createTable('order_items', table => {
    table.uuid('id').primary()
    table.uuid('order_id')
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE')
    table.uuid('catalog_item_id').notNullable()
    table.integer('quantity').notNullable()
    table.integer('price').notNullable()
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('order_items')
  await knex.schema.dropTable('orders')
}

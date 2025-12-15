import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.schema.createTable('payments', table => {
    table.uuid('id').primary()
    table.uuid('order_id').references('orders.id').onDelete('CASCADE')
    table.integer('amount').notNullable()
    table.string('phone').notNullable()
    table.enum('status', ['INITIATED', 'SUCCESS', 'FAILED'])
    table.string('mpesa_receipt')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('payments')
}

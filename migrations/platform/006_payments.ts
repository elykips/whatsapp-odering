import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary()

    table
      .uuid('order_id')
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE')

    table
      .uuid('vendor_id')
      .notNullable()
      .references('id')
      .inTable('vendors')
      .onDelete('CASCADE')

    table.string('phone', 20).notNullable()

    table.integer('amount').notNullable()

    table.string('status', 30).notNullable()
    // initiated | pending | paid | failed | expired

    table.string('checkout_request_id', 100)
    table.string('merchant_request_id', 100)
    table.string('mpesa_receipt', 100)

    table.string('result_code', 10)
    table.text('result_desc')

    table.jsonb('raw_callback')

    table.timestamps(true, true)

    table.index(['order_id'])
    table.index(['vendor_id'])
    table.index(['checkout_request_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payments')
}

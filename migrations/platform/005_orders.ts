import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary()

    table
      .uuid('vendor_id')
      .notNullable()
      .references('id')
      .inTable('vendors')
      .onDelete('CASCADE')

    table.string('customer_phone', 20).notNullable()

    table.string('currency', 10).notNullable().defaultTo('KES')

    // Amount in cents (KES * 100)
    table.integer('amount').notNullable()

    table
      .string('status', 30)
      .notNullable()
      .comment('created | payment_pending | paid | failed | fulfilled')

    table.jsonb('metadata').defaultTo({})

    table.timestamps(true, true)

    table.index(['vendor_id'])
    table.index(['status'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders')
}

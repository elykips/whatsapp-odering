import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payments', (t) => {
    t.uuid('id').primary()
    t.uuid('order_id').notNullable()
    t.uuid('vendor_id').notNullable()
    t.integer('amount').notNullable()
    t.string('status').notNullable()
    t.string('provider').notNullable()
    t.string('provider_ref')
    t.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payments')
}

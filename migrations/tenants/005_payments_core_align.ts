import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payments', (t) => {
    t.uuid('id').primary()
    t.uuid('vendor_id').notNullable()
    t.uuid('order_id').notNullable()

    t.integer('amount').notNullable()
    t.string('currency', 10).notNullable().defaultTo('KES')

    t.string('method', 30).notNullable()
    t.string('provider', 30).notNullable()
    t.string('status', 30).notNullable()

    t.string('reference', 120)
    t.jsonb('metadata').notNullable().defaultTo({})

    t.timestamps(true, true)

    t.index(['vendor_id'])
    t.index(['order_id'])
    t.index(['status'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payments')
}

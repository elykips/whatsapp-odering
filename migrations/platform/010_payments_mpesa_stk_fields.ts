import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payments', (t) => {
    t.string('merchant_request_id', 120)
    t.string('checkout_request_id', 120)
    t.integer('result_code')
    t.string('result_desc', 255)
    t.string('mpesa_receipt', 80)

    t.index(['checkout_request_id'])
    t.index(['merchant_request_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payments', (t) => {
    t.dropIndex(['checkout_request_id'])
    t.dropIndex(['merchant_request_id'])

    t.dropColumn('mpesa_receipt')
    t.dropColumn('result_desc')
    t.dropColumn('result_code')
    t.dropColumn('checkout_request_id')
    t.dropColumn('merchant_request_id')
  })
}

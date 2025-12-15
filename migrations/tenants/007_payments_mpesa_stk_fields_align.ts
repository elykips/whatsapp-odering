import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const cols = [
    ['merchant_request_id', () => knex.schema.alterTable('payments', t => t.string('merchant_request_id', 120))],
    ['checkout_request_id', () => knex.schema.alterTable('payments', t => t.string('checkout_request_id', 120))],
    ['result_code', () => knex.schema.alterTable('payments', t => t.integer('result_code'))],
    ['result_desc', () => knex.schema.alterTable('payments', t => t.string('result_desc', 255))],
    ['mpesa_receipt', () => knex.schema.alterTable('payments', t => t.string('mpesa_receipt', 80))]
  ] as const

  for (const [name, fn] of cols) {
    // @ts-ignore
    const has = await knex.schema.hasColumn('payments', name)
    if (!has) await fn()
  }

  await knex.raw('create index if not exists payments_checkout_request_id_idx on payments(checkout_request_id)')
  await knex.raw('create index if not exists payments_merchant_request_id_idx on payments(merchant_request_id)')
}

export async function down() {}

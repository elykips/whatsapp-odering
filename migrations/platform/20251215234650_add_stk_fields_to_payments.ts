import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const hasMerchant = await knex.schema.hasColumn('payments', 'merchant_request_id')
  const hasCheckout = await knex.schema.hasColumn('payments', 'checkout_request_id')
  const hasReceipt = await knex.schema.hasColumn('payments', 'mpesa_receipt')
  const hasResultCode = await knex.schema.hasColumn('payments', 'result_code')
  const hasResultDesc = await knex.schema.hasColumn('payments', 'result_desc')

  if (!hasMerchant || !hasCheckout || !hasReceipt || !hasResultCode || !hasResultDesc) {
    await knex.schema.alterTable('payments', (t) => {
      if (!hasMerchant) t.string('merchant_request_id')
      if (!hasCheckout) t.string('checkout_request_id')
      if (!hasReceipt) t.string('mpesa_receipt')
      if (!hasResultCode) t.integer('result_code')
      if (!hasResultDesc) t.string('result_desc')
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payments', (t) => {
    t.dropColumn('merchant_request_id')
    t.dropColumn('checkout_request_id')
    t.dropColumn('mpesa_receipt')
    t.dropColumn('result_code')
    t.dropColumn('result_desc')
  })
}

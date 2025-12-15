import { Knex } from 'knex'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  const vendor = await knex('vendors').first()

  if (!vendor) return

  await knex('orders').insert({
    id: randomUUID(),
    vendor_id: vendor.id,
    customer_phone: '254703283383',
    amount: 50000,
    status: 'created'
  })
}

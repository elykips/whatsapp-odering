import { Knex } from 'knex'
import { v4 as uuid } from 'uuid'

export async function seed(knex: Knex) {
  await knex('orders').del()

  await knex('orders').insert({
    id: uuid(),
    vendor_id: 'demo-vendor',
    customer_phone: '254703283383',
    status: 'DRAFT'
  })
}

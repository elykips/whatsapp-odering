import { Knex } from 'knex'
import { v4 as uuid } from 'uuid'

export async function seed(knex: Knex) {
  await knex('capabilities').del()

  await knex('capabilities').insert([
    {
      id: uuid(),
      capability_key: 'commerce.catalog',
      name: 'Catalog'
    },
    {
      id: uuid(),
      capability_key: 'commerce.orders',
      name: 'Orders'
    },
    {
      id: uuid(),
      capability_key: 'payments.mpesa_stk',
      name: 'M-Pesa STK'
    }
  ])
}

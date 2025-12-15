import { Knex } from 'knex'
import { v4 as uuid } from 'uuid'

export async function seed(knex: Knex) {
  await knex('vendors').del()

  await knex('vendors').insert({
    id: uuid(),
    name: "Java House, Rupa's Mall",
    country: 'KE'
  })
}

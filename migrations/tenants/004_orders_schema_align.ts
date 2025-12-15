import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (t) => {
    t.string('currency').notNullable().defaultTo('KES')
    t.jsonb('metadata').defaultTo({})
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('orders', (t) => {
    t.dropColumn('currency')
    t.dropColumn('metadata')
  })
}

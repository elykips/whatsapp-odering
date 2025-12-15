import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('vendor_payment_profiles', (t) => {
    t.uuid('id').primary()
    t.uuid('vendor_id').notNullable().unique()

    t.string('provider', 30).notNullable().defaultTo('safaricom')
    t.string('business_shortcode', 20).notNullable()

    // store secret *reference*, not the secret
    t.string('passkey_secret_ref', 255).notNullable()

    // optional overrides
    t.string('party_b', 20) // default to shortcode if null

    t.boolean('enabled').notNullable().defaultTo(true)
    t.timestamps(true, true)

    t.index(['vendor_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('vendor_payment_profiles')
}

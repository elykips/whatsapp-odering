import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('vendors', (t) => {
    t.string('isolation_level', 20).notNullable().defaultTo('shared') 
    // 'shared' | 'dedicated_db'

    // Store references, not secrets
    t.jsonb('db_target').nullable()
    // Example:
    // {
    //   "type": "postgres",
    //   "host": "127.0.0.1",
    //   "port": 5432,
    //   "database": "tenant_acme",
    //   "user": "tenant_acme",
    //   "passwordSecretRef": "gcp:projects/.../secrets/acme-db-pass"
    // }

    t.index(['isolation_level'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('vendors', (t) => {
    t.dropIndex(['isolation_level'])
    t.dropColumn('db_target')
    t.dropColumn('isolation_level')
  })
}

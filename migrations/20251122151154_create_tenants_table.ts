import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Needed for UUID primary keys
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable('tenants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('owner_email').notNullable();

    table
      .enu('plan', ['STARTER', 'GROWTH', 'PREMIUM'], {
        useNative: true,
        enumName: 'tenant_plan'
      })
      .notNullable()
      .defaultTo('STARTER');

    table
      .enu('status', ['active', 'suspended', 'trial'], {
        useNative: true,
        enumName: 'tenant_status'
      })
      .notNullable()
      .defaultTo('active');

    table.jsonb('limits').notNullable().defaultTo('{}');
    table.jsonb('whatsapp_credentials').notNullable().defaultTo('{}');
    table.jsonb('google_oauth').notNullable().defaultTo('{}');

    table.timestamps(true, true);

    table.unique(['owner_email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenants');
  await knex.raw('DROP TYPE IF EXISTS tenant_plan;');
  await knex.raw('DROP TYPE IF EXISTS tenant_status;');
}



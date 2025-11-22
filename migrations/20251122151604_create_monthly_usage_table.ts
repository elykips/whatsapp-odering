import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('usage_monthly', (table) => {
    table.increments('id').primary();

    table
      .uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.date('month_start').notNullable();

    table.integer('reservations_count').notNullable().defaultTo(0);
    table.integer('whatsapp_messages_count').notNullable().defaultTo(0);
    table.integer('review_requests_count').notNullable().defaultTo(0);

    table.timestamps(true, true);

    table.unique(['tenant_id', 'month_start']);
    table.index(['tenant_id'], 'idx_usage_tenant');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usage_monthly');
}

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('feedback', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    table
      .uuid('reservation_id')
      .references('id')
      .inTable('reservations')
      .onDelete('SET NULL');

    table
      .uuid('restaurant_id')
      .notNullable()
      .references('id')
      .inTable('restaurants')
      .onDelete('CASCADE');

    table.string('sentiment');
    table.text('summary');
    table.text('raw_text');

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['restaurant_id'], 'idx_feedback_restaurant');
    table.index(['sentiment'], 'idx_feedback_sentiment');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('feedback_log');
}

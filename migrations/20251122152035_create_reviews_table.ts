import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE review_reply_status AS ENUM ('none','drafted','published');
  `);

  await knex.schema.createTable('reviews', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    table
      .uuid('restaurant_id')
      .notNullable()
      .references('id')
      .inTable('restaurants')
      .onDelete('CASCADE');

    table.string('platform').notNullable().defaultTo('google');
    table.string('external_review_id').notNullable();

    table.integer('rating').notNullable();
    table.string('author');
    table.text('text');
    table.string('sentiment');

    table
      .enu('reply_status', null, {
        useNative: true,
        existingType: true,
        enumName: 'review_reply_status'
      })
      .notNullable()
      .defaultTo('none');

    table.timestamp('review_created_at', { useTz: true }).notNullable();

    table.timestamps(true, true);

    table.unique(['restaurant_id', 'platform', 'external_review_id']);
    table.index(['restaurant_id'], 'idx_reviews_restaurant');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reviews_log');
  await knex.raw('DROP TYPE IF EXISTS review_reply_status;');
}

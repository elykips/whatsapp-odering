// import { Knex } from 'knex';

// export async function up(knex: Knex): Promise<void> {
//   await knex.raw(`
//     CREATE TYPE reservation_status AS ENUM ('requested','confirmed','canceled','completed','no_show');
//   `);

//   await knex.raw(`
//     CREATE TYPE reservation_review_status AS ENUM ('none','asked','reviewed');
//   `);

//   await knex.schema.createTable('reservations', (table) => {
//     table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

//     table
//       .uuid('restaurant_id')
//       .notNullable()
//       .references('id')
//       .inTable('restaurants')
//       .onDelete('CASCADE');

//     table.string('customer_phone').notNullable();
//     table.string('customer_name');

//     table.timestamp('reservation_time', { useTz: true }).notNullable();

//     table.integer('guests').notNullable().defaultTo(1);

//     table
//       .enu('status', null, {
//         useNative: true,
//         existingType: true,
//         enumName: 'reservation_status'
//       })
//       .notNullable()
//       .defaultTo('confirmed');

//     table.string('source').notNullable().defaultTo('whatsapp');

//     table.boolean('feedback_sent').notNullable().defaultTo(false);

//     table
//       .enu('review_status', null, {
//         useNative: true,
//         existingType: true,
//         enumName: 'reservation_review_status'
//       })
//       .notNullable()
//       .defaultTo('none');

//     table.boolean('reminder_sent').notNullable().defaultTo(false);

//     table.jsonb('metadata').notNullable().defaultTo('{}');

//     table.timestamps(true, true);

//     table.index(['restaurant_id'], 'idx_reservation_restaurant');
//     table.index(['customer_phone'], 'idx_reservation_customer');
//     table.index(['reservation_time'], 'idx_reservation_time');
//   });
// }

// export async function down(knex: Knex): Promise<void> {
//   await knex.schema.dropTableIfExists('reservations');
//   await knex.raw('DROP TYPE IF EXISTS reservation_status;');
//   await knex.raw('DROP TYPE IF EXISTS reservation_review_status;');
// }

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('restaurants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('tenant_id')
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');

    table.string('name').notNullable();
    table.string('address');
    table.string('timezone').notNullable().defaultTo('UTC');
    table.string('whatsapp_number').notNullable();
    table.string('google_review_link');
    table.string('gmb_location_id');
    table.jsonb('config').notNullable().defaultTo('{}');
    table.string('config_version').notNullable().defaultTo('v1');
    table.timestamps(true, true);
    table.unique(['tenant_id', 'name']);
    table.unique(['whatsapp_number']);
    table.index(['tenant_id'], 'idx_restaurants_tenant');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('restaurants');
  await knex.raw('DROP TYPE IF EXISTS restaurant_status;');
}


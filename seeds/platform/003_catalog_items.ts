import { Knex } from 'knex'
import { v4 as uuid } from 'uuid'

export async function seed(knex: Knex) {
  // 1️⃣ Get an existing vendor (seeded in 001_vendors)
  const vendor = await knex('vendors').first()

  if (!vendor) {
    throw new Error(
      'No vendor found. Run 001_vendors seed before 003_catalog_items.'
    )
  }

  // 2️⃣ Clear existing catalog items
  await knex('catalog_items').del()

  // 3️⃣ Insert demo catalog items
  await knex('catalog_items').insert([
    {
      id: uuid(),
      vendor_id: vendor.id,
      name: 'Chicken & Rice',
      description: 'Grilled chicken served with rice',
      price: 500,
      currency: 'KES',
      active: true
    },
    {
      id: uuid(),
      vendor_id: vendor.id,
      name: 'Beef Burger',
      description: 'Beef burger with fries',
      price: 650,
      currency: 'KES',
      active: true
    },
    {
      id: uuid(),
      vendor_id: vendor.id,
      name: 'Fresh Juice',
      description: 'Seasonal fresh fruit juice',
      price: 250,
      currency: 'KES',
      active: true
    }
  ])
}

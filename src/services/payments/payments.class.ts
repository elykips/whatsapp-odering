import { KnexService } from '@feathersjs/knex'
import type { Application } from '@feathersjs/koa'
import type { KnexAdapterParams } from '@feathersjs/knex'
import type { Id } from '@feathersjs/feathers'
import { v4 as uuid } from 'uuid'

export class PaymentsService extends KnexService {
  app!: Application

  async setup(app: Application) {
    this.app = app
  }

  async create(
    data: any | any[],
    params?: KnexAdapterParams
  ): Promise<any | any[]> {
    const db = this.app.get('opsDb')

    if (Array.isArray(data)) {
      const payments = data.map(p => ({
        id: uuid(),
        order_id: p.order_id,
        amount: p.amount,
        phone: p.customer_phone,
        status: 'INITIATED'
      }))

      await db('payments').insert(payments)
      return payments
    }

    const payment = {
      id: uuid(),
      order_id: data.order_id,
      amount: data.amount,
      phone: data.customer_phone,
      status: 'INITIATED'
    }

    await db('payments').insert(payment)
    return payment
  }

  async patch(
    id: Id | null,
    data: any,
    params?: KnexAdapterParams
  ): Promise<any | any[]> {
    const db = this.app.get('opsDb')

    // 🔹 BULK PATCH (id === null)
    if (id === null) {
      const { query } = params || {}
      if (!query) {
        throw new Error('Bulk patch requires params.query')
      }

      await db('payments')
        .where(query)
        .update({
          ...data,
          updated_at: db.fn.now()
        })

      return db('payments').where(query)
    }

    // 🔹 SINGLE PATCH
    await db('payments')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now()
      })

    return db('payments').where({ id }).first()
  }
}

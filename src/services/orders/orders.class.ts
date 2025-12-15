import { KnexService } from '@feathersjs/knex'
import type { Application } from '@feathersjs/koa'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { v4 as uuid } from 'uuid'
import { randomUUID } from 'crypto'

export class OrdersService extends KnexService {
  app!: Application

  async setup(app: Application) {
    this.app = app
  }

  // async create(
  //   data: any | any[],
  //   params?: KnexAdapterParams
  // ): Promise<any | any[]> {
  //   const db = this.app.get('opsDb')

  //   // Handle bulk create (required for type compatibility)
  //   if (Array.isArray(data)) {
  //     const orders = data.map(item => ({
  //       id: uuid(),
  //       vendor_id: item.vendor_id,
  //       customer_phone: item.customer_phone,
  //       status: 'DRAFT',
  //       total: 0
  //     }))

  //     await db('orders').insert(orders)
  //     return orders
  //   }

  //   // Handle single create
  //   const order = {
  //     id: uuid(),
  //     vendor_id: data.vendor_id,
  //     customer_phone: data.customer_phone,
  //     status: 'DRAFT',
  //     total: 0
  //   }

  //   await db('orders').insert(order)
  //   return order
  // }

  async create(data: any, params: any) {
    return super.create({
      id: randomUUID(),
      vendor_id: data.vendor_id,
      customer_phone: data.customer_phone,
      amount: data.amount,
      currency: 'KES',
      status: 'created',
      metadata: data.metadata || {}
    }, params)
  }
}

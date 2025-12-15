import { KnexService } from '@feathersjs/knex'
import { randomUUID } from 'crypto'
import { BadRequest, Conflict, NotFound } from '@feathersjs/errors'
import { emitEvent } from '../../lib/events'

export class PaymentsService extends KnexService {
  async create(data: any, params: any) {
    const vendorId = params.vendor_id
    if (!vendorId) throw new BadRequest('vendor_id required')

    const { order_id, amount } = data
    if (!order_id) throw new BadRequest('order_id required')
    if (!amount || amount <= 0) throw new BadRequest('invalid amount')

    const db = params.adapter.Model

    const order = await db('orders').where({ id: order_id }).first()
    if (!order) throw new NotFound('Order not found')
    if (order.status === 'paid') throw new Conflict('Order already paid')

    const existing = await db('payments')
      .where({ order_id, status: 'success' })
      .first()

    if (existing) throw new Conflict('Successful payment already exists')

    const payment = {
      id: randomUUID(),
      vendor_id: vendorId,
      order_id,
      amount,
      currency: 'KES',
      method: data.method || 'mpesa_stk',
      provider: data.provider || 'safaricom',
      status: 'initiated',
      metadata: {}
    }

    const created = await super.create(payment, params)

    await emitEvent('payment.created', created)

    return created
  }
}

import type { Application } from '@feathersjs/koa'
import { emitEvent } from '../lib/events'

export const registerMpesaCallback = (app: Application) => {
  app.use(async (ctx, next) => {
    if (ctx.path !== '/mpesa/callback' || ctx.method !== 'POST') return next()

    const paymentId = ctx.query.payment_id as string
    const s = ctx.query.s as string
    if (!paymentId || !s || s !== process.env.MPESA_CALLBACK_SECRET) {
      ctx.status = 403
      ctx.body = { message: 'Forbidden' }
      return
    }

    const body = ctx.request.body as any
    const stk = body?.Body?.stkCallback
    if (!stk) {
      ctx.status = 400
      ctx.body = { message: 'Invalid callback payload' }
      return
    }

    const resultCode = Number(stk.ResultCode)
    const resultDesc = String(stk.ResultDesc || '')
    const checkoutRequestId = String(stk.CheckoutRequestID || '')
    const merchantRequestId = String(stk.MerchantRequestID || '')

    // Extract metadata items (Receipt, Amount, PhoneNumber, etc.)
    const items = stk.CallbackMetadata?.Item || []
    const getItem = (name: string) => items.find((x: any) => x.Name === name)?.Value

    const receipt = getItem('MpesaReceiptNumber') || null

    // We must locate the payment’s vendor + correct DB.
    // Easiest: store vendor_id on payment row; but we need the DB first.
    // Because payment_id is globally unique, we can look it up in BOTH DBs only if needed.
    // Better: require vendor_id in callback query too. For now, we’ll find vendor_id from platform registry:
    // We’ll scan platform DB "payment index" later; for Day5 keep it simple:
    //
    // RECOMMENDED CHANGE: include vendor_id in callbackUrl: ?payment_id=...&vendor_id=...&s=...
    //
    // For now assume vendor_id is stored in payment metadata and you can fetch it by checking platformDb + tenants.
    // Implement the recommended change immediately:

    const vendorId = ctx.query.vendor_id as string
    if (!vendorId) {
      ctx.status = 400
      ctx.body = { message: 'vendor_id required on callback (add to CallBackURL)' }
      return
    }

    const router = app.get('dbRouter')
    const { db } = await router.tenantDbForVendor(vendorId)

    const payment = await db('payments').where({ id: paymentId }).first()
    if (!payment) {
      ctx.status = 404
      ctx.body = { message: 'Payment not found' }
      return
    }

    // Idempotency: if already terminal, ack and stop
    if (payment.status === 'success' || payment.status === 'failed') {
      ctx.body = { ok: true }
      return
    }

    const newStatus = resultCode === 0 ? 'success' : 'failed'

    await db.transaction(async (trx: any) => {
      await trx('payments')
        .where({ id: paymentId })
        .update({
          status: newStatus,
          result_code: resultCode,
          result_desc: resultDesc,
          mpesa_receipt: receipt,
          checkout_request_id: checkoutRequestId || payment.checkout_request_id,
          merchant_request_id: merchantRequestId || payment.merchant_request_id,
          metadata: {
            ...(payment.metadata || {}),
            callback: body
          },
          updated_at: new Date()
        })

      if (newStatus === 'success') {
        await trx('orders')
          .where({ id: payment.order_id })
          .update({ status: 'paid', updated_at: new Date() })
      }
    })

    await emitEvent(newStatus === 'success' ? 'payment.succeeded' : 'payment.failed', {
      payment_id: paymentId,
      vendor_id: vendorId,
      order_id: payment.order_id,
      result_code: resultCode,
      result_desc: resultDesc,
      mpesa_receipt: receipt
    })

    ctx.body = { ok: true }
  })
}

import type { Application } from '@feathersjs/koa'
import { BadRequest, NotFound, Conflict } from '@feathersjs/errors'
import { getDarajaToken, stkPassword, timestampNow, stkPush } from '../../integrations/mpesa/daraja'
import { emitEvent } from '../../lib/events'

async function resolveSecret(ref: string) {
  if (ref.startsWith('plain:')) return ref.slice('plain:'.length)
  throw new Error(`Secret ref not supported yet: ${ref}`)
}

export const registerPaymentsStk = (app: Application) => {
  // Pathless Koa middleware (avoids ServiceTypes typing)
  app.use(async (ctx, next) => {
    if (!ctx.path.match(/^\/payments\/[^/]+\/initiate-stk$/) || ctx.method !== 'POST') {
      return next()
    }

    const internalKey = ctx.headers['x-internal-key']
    if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
      ctx.status = 403
      ctx.body = { message: 'Unauthorized' }
      return
    }

    const paymentId = ctx.path.split('/')[2]
    const vendorId = (ctx.headers['x-vendor-id'] as string) || (ctx.query.vendor_id as string)
    if (!vendorId) throw new BadRequest('x-vendor-id required')

    // Resolve tenant DB (L1/L3) using your router directly
    const router = app.get('dbRouter')
    const { db } = await router.tenantDbForVendor(vendorId)

    const payment = await db('payments').where({ id: paymentId }).first()
    if (!payment) throw new NotFound('Payment not found')
    if (payment.status === 'success') throw new Conflict('Payment already successful')

    const order = await db('orders').where({ id: payment.order_id }).first()
    if (!order) throw new NotFound('Order not found')

    // Vendor profile is in PLATFORM DB
    const platformDb = app.get('platformDb')
    const profile = await platformDb('vendor_payment_profiles')
      .where({ vendor_id: vendorId, enabled: true })
      .first()

    if (!profile) throw new BadRequest('Vendor STK profile missing/disabled')

    const env = (process.env.DARAJA_ENV as 'sandbox' | 'production') || 'sandbox'
    const consumerKey = process.env.DARAJA_CONSUMER_KEY!
    const consumerSecret = process.env.DARAJA_CONSUMER_SECRET!
    if (!consumerKey || !consumerSecret) throw new BadRequest('Missing DARAJA consumer key/secret')

    const passkey = await resolveSecret(profile.passkey_secret_ref)
    const shortcode = profile.business_shortcode as string
    const partyB = (profile.party_b as string) || shortcode

    // Public callback URL MUST be reachable by Safaricom (ngrok for dev)
    // const baseCallback = process.env.PUBLIC_BASE_URL // e.g. https://xxxx.ngrok-free.app
    // const callbackSecret = process.env.MPESA_CALLBACK_SECRET
    // if (!baseCallback || !callbackSecret) throw new BadRequest('Missing PUBLIC_BASE_URL or MPESA_CALLBACK_SECRET')

    // const callbackUrl = `${baseCallback}/mpesa/callback?payment_id=${paymentId}&s=${callbackSecret}`


    const baseCallback = process.env.PUBLIC_BASE_URL
    const callbackSecret = process.env.MPESA_CALLBACK_SECRET

    if (!baseCallback || !callbackSecret) {
    throw new BadRequest('Missing PUBLIC_BASE_URL or MPESA_CALLBACK_SECRET')
    }

    // const callbackUrl =
    // `${baseCallback}/mpesa/callback` +
    // `?payment_id=${paymentId}` +
    // `&vendor_id=${vendorId}` +
    // `&s=${callbackSecret}`

    const callbackUrl =
  `${baseCallback}/mpesa/callback` +
  `?payment_id=${encodeURIComponent(paymentId)}` +
  `&vendor_id=${encodeURIComponent(vendorId)}` +
  `&s=${encodeURIComponent(callbackSecret)}`



    const timestamp = timestampNow()
    const password = stkPassword(shortcode, passkey, timestamp)

    const token = await getDarajaToken(env, consumerKey, consumerSecret)

    // NOTE: PhoneNumber must be 2547XXXXXXXX (no +)
    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: payment.amount,
      PartyA: order.customer_phone,
      PartyB: partyB,
      PhoneNumber: order.customer_phone,
      CallBackURL: callbackUrl,
      AccountReference: order.id,
      TransactionDesc: `Order ${order.id}`
    }

    const res = await stkPush(env, token, payload)

    const { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage } = res.data

    await db('payments')
      .where({ id: paymentId })
      .update({
        status: 'pending',
        merchant_request_id: MerchantRequestID,
        checkout_request_id: CheckoutRequestID,
        metadata: {
          ...(payment.metadata || {}),
          stk: { ResponseCode, ResponseDescription, CustomerMessage, callbackUrl }
        },
        updated_at: new Date()
      })

    await emitEvent('payment.initiated', {
      payment_id: paymentId,
      vendor_id: vendorId,
      order_id: payment.order_id,
      checkout_request_id: CheckoutRequestID,
      merchant_request_id: MerchantRequestID
    })

    ctx.body = { ok: true, MerchantRequestID, CheckoutRequestID, CustomerMessage }
  })
}

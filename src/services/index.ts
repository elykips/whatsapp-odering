import type { Application } from '@feathersjs/koa'

import { vendors } from './vendors/vendors'
import { sessions } from './sessions/sessions'
import { catalog } from './catalog/catalog'
import { orders } from './orders/orders'
import { payments } from './payments/payments'

export const services = (app: Application) => {
  app.configure(vendors)
  app.configure(sessions)
  app.configure(catalog)
  app.configure(orders)
  app.configure(payments)
}

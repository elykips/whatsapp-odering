import type { ServiceAddons } from '@feathersjs/feathers'

import type { SessionsService } from './services/sessions/sessions.class'
import type { CatalogService } from './services/catalog/catalog.class'
import type { OrdersService } from './services/orders/orders.class'
import type { PaymentsService } from './services/payments/payments.class'

export interface ServiceTypes {
  sessions: SessionsService & ServiceAddons<any>
  catalog: CatalogService & ServiceAddons<any>
  orders: OrdersService & ServiceAddons<any>
  payments: PaymentsService & ServiceAddons<any>
}

declare module './declarations' {
  interface ApplicationConfiguration {
    dbRouter: any
  }
}


import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { vendorsClient } from './services/vendors/vendors.shared'

import { sessionsClient } from './services/sessions/sessions.shared'
import { catalogClient } from './services/catalog/catalog.shared'
import { ordersClient } from './services/orders/orders.shared'
import { paymentsClient } from './services/payments/payments.shared'

export type ClientApplication = Application<any>

export const createClient = (
  connection: TransportConnection,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
): ClientApplication => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(sessionsClient)
  client.configure(catalogClient)
  client.configure(ordersClient)
  client.configure(paymentsClient)
  client.configure(vendorsClient)
  return client
}

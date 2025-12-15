import type { ClientApplication } from '../../client'

export interface Session {
  vendor_id: string
  customer_phone: string
  state: string
  context?: Record<string, any>
}

export interface SessionData {
  vendor_id: string
  customer_phone: string
  state: string
  context?: Record<string, any>
}

export const sessionsClient = (client: ClientApplication) => {
  client.use('sessions', client.service('sessions'))
}

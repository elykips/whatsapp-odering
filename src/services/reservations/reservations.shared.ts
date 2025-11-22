// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Reservation,
  ReservationData,
  ReservationPatch,
  ReservationQuery,
  ReservationService
} from './reservations.class'

export type { Reservation, ReservationData, ReservationPatch, ReservationQuery }

export type ReservationClientService = Pick<
  ReservationService<Params<ReservationQuery>>,
  (typeof reservationMethods)[number]
>

export const reservationPath = 'reservations'

export const reservationMethods: Array<keyof ReservationService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const reservationClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(reservationPath, connection.service(reservationPath), {
    methods: reservationMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [reservationPath]: ReservationClientService
  }
}

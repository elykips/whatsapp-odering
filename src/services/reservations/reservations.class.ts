// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Reservation, ReservationData, ReservationPatch, ReservationQuery } from './reservations.schema'

export type { Reservation, ReservationData, ReservationPatch, ReservationQuery }

export interface ReservationParams extends KnexAdapterParams<ReservationQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ReservationService<ServiceParams extends Params = ReservationParams> extends KnexService<
  Reservation,
  ReservationData,
  ReservationParams,
  ReservationPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'reservations'
  }
}

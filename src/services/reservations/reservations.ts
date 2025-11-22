// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  reservationDataValidator,
  reservationPatchValidator,
  reservationQueryValidator,
  reservationResolver,
  reservationExternalResolver,
  reservationDataResolver,
  reservationPatchResolver,
  reservationQueryResolver
} from './reservations.schema'

import type { Application } from '../../declarations'
import { ReservationService, getOptions } from './reservations.class'
import { reservationPath, reservationMethods } from './reservations.shared'

export * from './reservations.class'
export * from './reservations.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const reservation = (app: Application) => {
  // Register our service on the Feathers application
  app.use(reservationPath, new ReservationService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: reservationMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(reservationPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(reservationExternalResolver),
        schemaHooks.resolveResult(reservationResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(reservationQueryValidator),
        schemaHooks.resolveQuery(reservationQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(reservationDataValidator),
        schemaHooks.resolveData(reservationDataResolver)
      ],
      patch: [
        schemaHooks.validateData(reservationPatchValidator),
        schemaHooks.resolveData(reservationPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [reservationPath]: ReservationService
  }
}

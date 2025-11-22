// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  restaurantDataValidator,
  restaurantPatchValidator,
  restaurantQueryValidator,
  restaurantResolver,
  restaurantExternalResolver,
  restaurantDataResolver,
  restaurantPatchResolver,
  restaurantQueryResolver
} from './restaurants.schema'

import type { Application } from '../../declarations'
import { RestaurantService, getOptions } from './restaurants.class'
import { restaurantPath, restaurantMethods } from './restaurants.shared'

export * from './restaurants.class'
export * from './restaurants.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const restaurant = (app: Application) => {
  // Register our service on the Feathers application
  app.use(restaurantPath, new RestaurantService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: restaurantMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(restaurantPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(restaurantExternalResolver),
        schemaHooks.resolveResult(restaurantResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(restaurantQueryValidator),
        schemaHooks.resolveQuery(restaurantQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(restaurantDataValidator),
        schemaHooks.resolveData(restaurantDataResolver)
      ],
      patch: [
        schemaHooks.validateData(restaurantPatchValidator),
        schemaHooks.resolveData(restaurantPatchResolver)
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
    [restaurantPath]: RestaurantService
  }
}

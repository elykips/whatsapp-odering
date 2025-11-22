// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  reviewDataValidator,
  reviewPatchValidator,
  reviewQueryValidator,
  reviewResolver,
  reviewExternalResolver,
  reviewDataResolver,
  reviewPatchResolver,
  reviewQueryResolver
} from './reviews.schema'

import type { Application } from '../../declarations'
import { ReviewService, getOptions } from './reviews.class'
import { reviewPath, reviewMethods } from './reviews.shared'

export * from './reviews.class'
export * from './reviews.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const review = (app: Application) => {
  // Register our service on the Feathers application
  app.use(reviewPath, new ReviewService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: reviewMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(reviewPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(reviewExternalResolver), schemaHooks.resolveResult(reviewResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(reviewQueryValidator), schemaHooks.resolveQuery(reviewQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(reviewDataValidator), schemaHooks.resolveData(reviewDataResolver)],
      patch: [schemaHooks.validateData(reviewPatchValidator), schemaHooks.resolveData(reviewPatchResolver)],
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
    [reviewPath]: ReviewService
  }
}

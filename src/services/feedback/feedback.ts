// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  feedbackDataValidator,
  feedbackPatchValidator,
  feedbackQueryValidator,
  feedbackResolver,
  feedbackExternalResolver,
  feedbackDataResolver,
  feedbackPatchResolver,
  feedbackQueryResolver
} from './feedback.schema'

import type { Application } from '../../declarations'
import { FeedbackService, getOptions } from './feedback.class'
import { feedbackPath, feedbackMethods } from './feedback.shared'

export * from './feedback.class'
export * from './feedback.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const feedback = (app: Application) => {
  // Register our service on the Feathers application
  app.use(feedbackPath, new FeedbackService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: feedbackMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(feedbackPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(feedbackExternalResolver),
        schemaHooks.resolveResult(feedbackResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(feedbackQueryValidator),
        schemaHooks.resolveQuery(feedbackQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(feedbackDataValidator),
        schemaHooks.resolveData(feedbackDataResolver)
      ],
      patch: [
        schemaHooks.validateData(feedbackPatchValidator),
        schemaHooks.resolveData(feedbackPatchResolver)
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
    [feedbackPath]: FeedbackService
  }
}

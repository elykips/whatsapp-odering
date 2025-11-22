// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  usageDataValidator,
  usagePatchValidator,
  usageQueryValidator,
  usageResolver,
  usageExternalResolver,
  usageDataResolver,
  usagePatchResolver,
  usageQueryResolver
} from './usage.schema'

import type { Application } from '../../declarations'
import { UsageService, getOptions } from './usage.class'
import { usagePath, usageMethods } from './usage.shared'

export * from './usage.class'
export * from './usage.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const usage = (app: Application) => {
  // Register our service on the Feathers application
  app.use(usagePath, new UsageService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: usageMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(usagePath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(usageExternalResolver), schemaHooks.resolveResult(usageResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(usageQueryValidator), schemaHooks.resolveQuery(usageQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(usageDataValidator), schemaHooks.resolveData(usageDataResolver)],
      patch: [schemaHooks.validateData(usagePatchValidator), schemaHooks.resolveData(usagePatchResolver)],
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
    [usagePath]: UsageService
  }
}

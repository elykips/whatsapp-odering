// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Usage, UsageData, UsagePatch, UsageQuery, UsageService } from './usage.class'

export type { Usage, UsageData, UsagePatch, UsageQuery }

export type UsageClientService = Pick<UsageService<Params<UsageQuery>>, (typeof usageMethods)[number]>

export const usagePath = 'usage'

export const usageMethods: Array<keyof UsageService> = ['find', 'get', 'create', 'patch', 'remove']

export const usageClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(usagePath, connection.service(usagePath), {
    methods: usageMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [usagePath]: UsageClientService
  }
}

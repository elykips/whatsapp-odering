// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Usage, UsageData, UsagePatch, UsageQuery } from './usage.schema'

export type { Usage, UsageData, UsagePatch, UsageQuery }

export interface UsageParams extends KnexAdapterParams<UsageQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UsageService<ServiceParams extends Params = UsageParams> extends KnexService<
  Usage,
  UsageData,
  UsageParams,
  UsagePatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'usage'
  }
}

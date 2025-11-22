// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Feedback, FeedbackData, FeedbackPatch, FeedbackQuery } from './feedback.schema'

export type { Feedback, FeedbackData, FeedbackPatch, FeedbackQuery }

export interface FeedbackParams extends KnexAdapterParams<FeedbackQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class FeedbackService<ServiceParams extends Params = FeedbackParams> extends KnexService<
  Feedback,
  FeedbackData,
  FeedbackParams,
  FeedbackPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'feedback'
  }
}

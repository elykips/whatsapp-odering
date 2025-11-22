// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Feedback, FeedbackData, FeedbackPatch, FeedbackQuery, FeedbackService } from './feedback.class'

export type { Feedback, FeedbackData, FeedbackPatch, FeedbackQuery }

export type FeedbackClientService = Pick<
  FeedbackService<Params<FeedbackQuery>>,
  (typeof feedbackMethods)[number]
>

export const feedbackPath = 'feedback'

export const feedbackMethods: Array<keyof FeedbackService> = ['find', 'get', 'create', 'patch', 'remove']

export const feedbackClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(feedbackPath, connection.service(feedbackPath), {
    methods: feedbackMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [feedbackPath]: FeedbackClientService
  }
}

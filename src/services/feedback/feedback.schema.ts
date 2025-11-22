// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FeedbackService } from './feedback.class'

// Main data model schema
export const feedbackSchema = Type.Object(
  {
    id: Type.Optional(Type.String()),
    tenant_id: Type.String(),
    restaurant_id: Type.String(),
    reservation_id: Type.Optional(Type.String()),
    source_phone: Type.String(),
    source_channel: Type.String(), // whatsapp/web/etc
    raw_text: Type.String(),
    ai_summary: Type.Optional(Type.String()),
    ai_sentiment: Type.Optional(Type.String()), // positive/negative/neutral
    ai_score: Type.Optional(Type.Number()),     // numeric 1–100
    categories: Type.Optional(Type.Array(Type.String())),
    issues: Type.Optional(Type.Object({}, { additionalProperties: true })),
    feedback_type: Type.Optional(Type.String()), // complaint/compliment/suggestion
    status: Type.Optional(Type.String()),        // open/resolved/escalated
    created_at: Type.Optional(Type.String()),
    updated_at: Type.Optional(Type.String())
  },
  { $id: 'Feedback', additionalProperties: false }
)
export type Feedback = Static<typeof feedbackSchema>
export const feedbackValidator = getValidator(feedbackSchema, dataValidator)
export const feedbackResolver = resolve<FeedbackQuery, HookContext<FeedbackService>>({})

export const feedbackExternalResolver = resolve<Feedback, HookContext<FeedbackService>>({})

// Schema for creating new entries
export const feedbackDataSchema = Type.Pick(feedbackSchema, [
  'tenant_id',
  'restaurant_id',
  'reservation_id',
  'source_phone',
  'source_channel',
  'raw_text',
  'created_at',
], {
  $id: 'FeedbackData'
})
export type FeedbackData = Static<typeof feedbackDataSchema>
export const feedbackDataValidator = getValidator(feedbackDataSchema, dataValidator)
export const feedbackDataResolver = resolve<FeedbackData, HookContext<FeedbackService>>({})

// Schema for updating existing entries
export const feedbackPatchSchema = Type.Partial(feedbackSchema, {
  $id: 'FeedbackPatch'
})
export type FeedbackPatch = Static<typeof feedbackPatchSchema>
export const feedbackPatchValidator = getValidator(feedbackPatchSchema, dataValidator)
export const feedbackPatchResolver = resolve<FeedbackPatch, HookContext<FeedbackService>>({})

// Schema for allowed query properties
export const feedbackQueryProperties = Type.Pick(feedbackSchema, [
  'id',
  'tenant_id',
  'restaurant_id',
  'reservation_id',
  'source_phone',
  'source_channel',
  'ai_sentiment',
  'feedback_type',
  'status',
  'created_at',
  'updated_at'  
])
export const feedbackQuerySchema = Type.Intersect(
  [
    querySyntax(feedbackQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type FeedbackQuery = Static<typeof feedbackQuerySchema>
export const feedbackQueryValidator = getValidator(feedbackQuerySchema, queryValidator)
export const feedbackQueryResolver = resolve<FeedbackQuery, HookContext<FeedbackService>>({})

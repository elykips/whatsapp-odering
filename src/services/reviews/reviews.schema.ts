// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ReviewService } from './reviews.class'

// Main data model schema
export const reviewSchema = Type.Object(
  {
    id: Type.Optional(Type.String()),
    restaurant_id: Type.String(),
    platform: Type.String(),
    external_review_id: Type.String(),
    rating: Type.Number(),
    author: Type.Optional(Type.String()),
    text: Type.Optional(Type.String()),
    sentiment: Type.Optional(Type.String()),
    reply_status: Type.Optional(Type.String()),
    review_created_at: Type.String()
  },
  { $id: 'Review', additionalProperties: false }
)
export type Review = Static<typeof reviewSchema>
export const reviewValidator = getValidator(reviewSchema, dataValidator)
export const reviewResolver = resolve<ReviewQuery, HookContext<ReviewService>>({})

export const reviewExternalResolver = resolve<Review, HookContext<ReviewService>>({})

// Schema for creating new entries
export const reviewDataSchema = Type.Pick(reviewSchema, [
  'restaurant_id',
  'platform',
  'external_review_id',
  'rating',
  'author',
  'text',
  'sentiment',
  'reply_status',
  'review_created_at' 
], {
  $id: 'ReviewData'
})
export type ReviewData = Static<typeof reviewDataSchema>
export const reviewDataValidator = getValidator(reviewDataSchema, dataValidator)
export const reviewDataResolver = resolve<ReviewData, HookContext<ReviewService>>({})

// Schema for updating existing entries
export const reviewPatchSchema = Type.Partial(reviewSchema, {
  $id: 'ReviewPatch'
})
export type ReviewPatch = Static<typeof reviewPatchSchema>
export const reviewPatchValidator = getValidator(reviewPatchSchema, dataValidator)
export const reviewPatchResolver = resolve<ReviewPatch, HookContext<ReviewService>>({})

// Schema for allowed query properties
export const reviewQueryProperties = Type.Pick(reviewSchema, [
  'id',
  'restaurant_id',
  'platform',
  'external_review_id',
  'rating',
  'author',
  'text',
  'sentiment',
  'reply_status',
  'review_created_at'
])
export const reviewQuerySchema = Type.Intersect(
  [
    querySyntax(reviewQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ReviewQuery = Static<typeof reviewQuerySchema>
export const reviewQueryValidator = getValidator(reviewQuerySchema, queryValidator)
export const reviewQueryResolver = resolve<ReviewQuery, HookContext<ReviewService>>({})

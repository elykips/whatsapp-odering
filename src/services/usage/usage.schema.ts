// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UsageService } from './usage.class'

// Main data model schema
export const usageSchema = Type.Object(
  {
    id: Type.Optional(Type.Number()),
    tenant_id: Type.String(),
    month_start: Type.String(),
    reservations_count: Type.Optional(Type.Number()),
    whatsapp_messages_count: Type.Optional(Type.Number()),
    review_requests_count: Type.Optional(Type.Number())
  },
  { $id: 'Usage', additionalProperties: false }
)
export type Usage = Static<typeof usageSchema>
export const usageValidator = getValidator(usageSchema, dataValidator)
export const usageResolver = resolve<UsageQuery, HookContext<UsageService>>({})

export const usageExternalResolver = resolve<Usage, HookContext<UsageService>>({})

// Schema for creating new entries
export const usageDataSchema = Type.Pick(usageSchema, [
  'tenant_id',
  'month_start',
  'reservations_count',
  'whatsapp_messages_count',
  'review_requests_count'
], {
  $id: 'UsageData'
})
export type UsageData = Static<typeof usageDataSchema>
export const usageDataValidator = getValidator(usageDataSchema, dataValidator)
export const usageDataResolver = resolve<UsageData, HookContext<UsageService>>({})

// Schema for updating existing entries
export const usagePatchSchema = Type.Partial(usageSchema, {
  $id: 'UsagePatch'
})
export type UsagePatch = Static<typeof usagePatchSchema>
export const usagePatchValidator = getValidator(usagePatchSchema, dataValidator)
export const usagePatchResolver = resolve<UsagePatch, HookContext<UsageService>>({})

// Schema for allowed query properties
export const usageQueryProperties = Type.Pick(usageSchema, [
  'id',
  'tenant_id',
  'month_start',
  'reservations_count',
  'whatsapp_messages_count',
  'review_requests_count'
])
export const usageQuerySchema = Type.Intersect(
  [
    querySyntax(usageQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UsageQuery = Static<typeof usageQuerySchema>
export const usageQueryValidator = getValidator(usageQuerySchema, queryValidator)
export const usageQueryResolver = resolve<UsageQuery, HookContext<UsageService>>({})

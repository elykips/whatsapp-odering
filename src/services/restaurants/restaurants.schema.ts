// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { RestaurantService } from './restaurants.class'

// Main data model schema
export const restaurantSchema = Type.Object(
  {
    id: Type.Optional(Type.String()),
    tenant_id: Type.String(),
    name: Type.String(),
    address: Type.Optional(Type.String()),
    timezone: Type.String(),
    whatsapp_number: Type.String(),
    google_review_link: Type.Optional(Type.String()),
    gmb_location_id: Type.Optional(Type.String()),
    config: Type.Optional(Type.Object({}, { additionalProperties: true })),
    config_version: Type.Optional(Type.String())
    },
  { $id: 'Restaurant', additionalProperties: false }
)
export type Restaurant = Static<typeof restaurantSchema>
export const restaurantValidator = getValidator(restaurantSchema, dataValidator)
export const restaurantResolver = resolve<RestaurantQuery, HookContext<RestaurantService>>({})

export const restaurantExternalResolver = resolve<Restaurant, HookContext<RestaurantService>>({})

// Schema for creating new entries
export const restaurantDataSchema = Type.Pick(restaurantSchema, [
  'tenant_id',
  'name',
  'address',
  'timezone',
  'whatsapp_number',
  'google_review_link',
  'gmb_location_id',
  'config',
  'config_version'
], {
  $id: 'RestaurantData'
})
export type RestaurantData = Static<typeof restaurantDataSchema>
export const restaurantDataValidator = getValidator(restaurantDataSchema, dataValidator)
export const restaurantDataResolver = resolve<RestaurantData, HookContext<RestaurantService>>({})

// Schema for updating existing entries
export const restaurantPatchSchema = Type.Partial(restaurantSchema, {
  $id: 'RestaurantPatch'
})
export type RestaurantPatch = Static<typeof restaurantPatchSchema>
export const restaurantPatchValidator = getValidator(restaurantPatchSchema, dataValidator)
export const restaurantPatchResolver = resolve<RestaurantPatch, HookContext<RestaurantService>>({})

// Schema for allowed query properties
export const restaurantQueryProperties = Type.Pick(restaurantSchema, [
  'id',
  'tenant_id',
  'name',
  'address',
  'timezone',
  'whatsapp_number',
  'google_review_link'
])
export const restaurantQuerySchema = Type.Intersect(
  [
    querySyntax(restaurantQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type RestaurantQuery = Static<typeof restaurantQuerySchema>
export const restaurantQueryValidator = getValidator(restaurantQuerySchema, queryValidator)
export const restaurantQueryResolver = resolve<RestaurantQuery, HookContext<RestaurantService>>({})

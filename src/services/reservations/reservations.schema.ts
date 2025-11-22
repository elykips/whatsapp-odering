// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ReservationService } from './reservations.class'

// Main data model schema
export const reservationSchema = Type.Object(
  {
      id: Type.Optional(Type.String()),
      restaurant_id: Type.String(),
      customer_phone: Type.String(),
      customer_name: Type.Optional(Type.String()),
      reservation_time: Type.String(),
      guests: Type.Optional(Type.Number()),
      status: Type.Optional(Type.String()),
      source: Type.Optional(Type.String()),
      feedback_sent: Type.Optional(Type.Boolean()),
      review_status: Type.Optional(Type.String()),
      reminder_sent: Type.Optional(Type.Boolean()),
      metadata: Type.Optional(Type.Object({}, { additionalProperties: true }))
  },
  { $id: 'Reservation', additionalProperties: false }
)
export type Reservation = Static<typeof reservationSchema>
export const reservationValidator = getValidator(reservationSchema, dataValidator)
export const reservationResolver = resolve<ReservationQuery, HookContext<ReservationService>>({})

export const reservationExternalResolver = resolve<Reservation, HookContext<ReservationService>>({})

// Schema for creating new entries
export const reservationDataSchema = Type.Pick(reservationSchema, [
  'restaurant_id',
  'customer_phone',
  'customer_name',
  'reservation_time',
  'guests',
  'status',
  'source',
  'feedback_sent',
  'review_status',
  'reminder_sent',
  'metadata'
], {
  $id: 'ReservationData'
})
export type ReservationData = Static<typeof reservationDataSchema>
export const reservationDataValidator = getValidator(reservationDataSchema, dataValidator)
export const reservationDataResolver = resolve<ReservationData, HookContext<ReservationService>>({})

// Schema for updating existing entries
export const reservationPatchSchema = Type.Partial(reservationSchema, {
  $id: 'ReservationPatch'
})
export type ReservationPatch = Static<typeof reservationPatchSchema>
export const reservationPatchValidator = getValidator(reservationPatchSchema, dataValidator)
export const reservationPatchResolver = resolve<ReservationPatch, HookContext<ReservationService>>({})

// Schema for allowed query properties
export const reservationQueryProperties = Type.Pick(reservationSchema, [
  'id',
  'restaurant_id',
  'customer_phone',
  'customer_name',
  'reservation_time',
  'guests',
  'status',
  'source',
  'feedback_sent',
  'review_status',
  'reminder_sent'
])
export const reservationQuerySchema = Type.Intersect(
  [
    querySyntax(reservationQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ReservationQuery = Static<typeof reservationQuerySchema>
export const reservationQueryValidator = getValidator(reservationQuerySchema, queryValidator)
export const reservationQueryResolver = resolve<ReservationQuery, HookContext<ReservationService>>({})

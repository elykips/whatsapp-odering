// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TenantService } from './tenants.class'

// Main data model schema
export const tenantSchema = Type.Object(
  {
    id: Type.Optional(Type.String()),
    name: Type.String(),
    owner_email: Type.String(),
    plan: Type.Union([
      Type.Literal('STARTER'),
      Type.Literal('GROWTH'),
      Type.Literal('PREMIUM')
    ]),
    status: Type.Union([
      Type.Literal('active'),
      Type.Literal('suspended'),
      Type.Literal('trial')
    ]),
    limits: Type.Optional(Type.Object({}, { additionalProperties: true })),
    whatsapp_credentials: Type.Optional(Type.Object({}, { additionalProperties: true })),
    google_oauth: Type.Optional(Type.Object({}, { additionalProperties: true }))
  },
  { $id: 'Tenant', additionalProperties: true }
)
export type Tenant = Static<typeof tenantSchema>
export const tenantValidator = getValidator(tenantSchema, dataValidator)
export const tenantResolver = resolve<TenantQuery, HookContext<TenantService>>({})

export const tenantExternalResolver = resolve<Tenant, HookContext<TenantService>>({})

// Schema for creating new entries
export const tenantDataSchema = Type.Pick(tenantSchema, [
  'name',
  'owner_email',
  'plan',
  'status'
], {
  $id: 'TenantData'
})
export type TenantData = Static<typeof tenantDataSchema>
export const tenantDataValidator = getValidator(tenantDataSchema, dataValidator)
export const tenantDataResolver = resolve<TenantData, HookContext<TenantService>>({})

// Schema for updating existing entries
export const tenantPatchSchema = Type.Partial(tenantSchema, {
  $id: 'TenantPatch'
})
export type TenantPatch = Static<typeof tenantPatchSchema>
export const tenantPatchValidator = getValidator(tenantPatchSchema, dataValidator)
export const tenantPatchResolver = resolve<TenantPatch, HookContext<TenantService>>({})

// Schema for allowed query properties
export const tenantQueryProperties = Type.Pick(tenantSchema, [
  'name',
  'owner_email',
  'plan',
  'status'
])
export const tenantQuerySchema = Type.Intersect(
  [
    querySyntax(tenantQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TenantQuery = Static<typeof tenantQuerySchema>
export const tenantQueryValidator = getValidator(tenantQuerySchema, queryValidator)
export const tenantQueryResolver = resolve<TenantQuery, HookContext<TenantService>>({})

// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  tenantDataValidator,
  tenantPatchValidator,
  tenantQueryValidator,
  tenantResolver,
  tenantExternalResolver,
  tenantDataResolver,
  tenantPatchResolver,
  tenantQueryResolver
} from './tenants.schema'

import Router from '@koa/router'

import type { Application } from '../../declarations'
import { TenantService, getOptions } from './tenants.class'
import { tenantPath, tenantMethods } from './tenants.shared'

import { sendWhatsApp } from '../../utils/whatsapp'
import { fetchReviews, postReply } from '../../utils/google'


export * from './tenants.class'
export * from './tenants.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const tenant = (app: Application) => {
  const db = app.get('postgresqlClient');

  // Register our service on the Feathers application
  app.use(tenantPath, new TenantService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: tenantMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  // Koa router for custom endpoints
  const router = new Router()
  
   router.get('/tenants/:tenantId/restaurants/:restaurantId/google-reviews', async (ctx: any) => {
    const { tenantId, restaurantId } = ctx.params;
  
      const tenant = await db('tenants').where({ id: tenantId }).first();
      const restaurant = await db('restaurants').where({ id: restaurantId }).first();
  
      if (!tenant || !restaurant) {
        ctx.status = 404;
        ctx.body = { error: 'TenantOrRestaurantNotFound' };
        return;
      }
  
      const reviews = await fetchReviews({
        gmbLocationId: restaurant.gmb_location_id,
        oauthToken: tenant.google_oauth
      });
  
      ctx.body = {
        locationId: restaurant.gmb_location_id,
        reviews
      };
    });
    
  router.post('/tenants/:tenantId/restaurants/:restaurantId/google-reviews/reply', async (ctx: any) => {
      const { tenantId, restaurantId } = ctx.params;
      const { reviewId, replyText } = ctx.request.body || {};
  
      const tenant = await db('tenants').where({ id: tenantId }).first();
      const restaurant = await db('restaurants').where({ id: restaurantId }).first();
  
      if (!tenant || !restaurant) {
        ctx.status = 404;
        ctx.body = { error: 'TenantOrRestaurantNotFound' };
        return;
      }
  
      const result = await postReply({
        gmbLocationId: restaurant.gmb_location_id,
        reviewId,
        replyText,
        oauthToken: tenant.google_oauth
      });
  
      ctx.body = { status: 'posted', reviewId, result };
  });

  router.get('/tenants/resolve/:whatsappNumber', async (ctx: any) => {
    // const whatsappNumber = ctx.request.query.whatsappNumber as string | undefined;
    const { whatsappNumber } = ctx.params;

    if (!whatsappNumber) {
      ctx.status = 400;
      ctx.body = { error: 'Missing whatsappNumber' };
      return;
    }

    // 1) find restaurant by whatsapp_number
    const restaurant = await db('restaurants')
      .where({ whatsapp_number: whatsappNumber })
      .first();

    if (!restaurant) {
      ctx.status = 404;
      ctx.body = { error: 'RestaurantNotFound' };
      return;
    }

    // 2) fetch the tenant
    const tenant = await db('tenants')
      .where({ id: restaurant.tenant_id })
      .first();

    if (!tenant) {
      ctx.status = 404;
      ctx.body = { error: 'TenantNotFound' };
      return;
    }

    // 3) return full context object n8n needs
    ctx.body = {
      tenantId: tenant.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      timezone: restaurant.timezone,
      plan: tenant.plan,
      configVersion: restaurant.config_version,
      config: restaurant.config || {}
    };
  });

  router.post('/tenants/:tenantId/check-limit', async (ctx: any) => {
    const tenantId = ctx.params.tenantId as string;
    const { type, amount } = ctx.request.body || {};

    const tenant = await db('tenants').where({ id: tenantId }).first();
    if (!tenant) {
      ctx.status = 404;
      ctx.body = { error: 'TenantNotFound' };
      return;
    }

    const limits = tenant.limits || {};
    const limit = limits[type] || null;

    if (!limit) {
      ctx.body = { allowed: true, remaining: null };
      return;
    }

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      .toISOString()
      .slice(0, 10);

    let usage = await db('usage_monthly')
      .where({ tenant_id: tenantId, month_start: monthStart })
      .first();

    if (!usage) {
      usage = {
        reservations_count: 0,
        whatsapp_messages_count: 0,
        review_requests_count: 0
      };
    }

    const key = `${type}_count`;
    const current = (usage as any)[key] || 0;
    const requested = amount || 1;

    if (current + requested > limit) {
      ctx.body = {
        allowed: false,
        limit,
        usage: current,
        errorMessage: `Monthly ${type} limit reached`
      };
      return;
    }

    ctx.body = {
      allowed: true,
      remaining: limit - (current + requested)
    };
  });

  router.post('/tenants/:tenantId/add-usage', async (ctx: any) => {
    const tenantId = ctx.params.tenantId as string;
    const deltas = ctx.request.body || {};

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      .toISOString()
      .slice(0, 10);

    let row = await db('usage_monthly')
      .where({ tenant_id: tenantId, month_start: monthStart })
      .first();

    if (!row) {
      const [created] = await db('usage_monthly')
        .insert({ tenant_id: tenantId, month_start: monthStart })
        .returning('*');
      row = created;
    }

    const newValues: any = {
      reservations_count: row.reservations_count,
      whatsapp_messages_count: row.whatsapp_messages_count,
      review_requests_count: row.review_requests_count
    };

    if (deltas.reservations) newValues.reservations_count += deltas.reservations;
    if (deltas.messages) newValues.whatsapp_messages_count += deltas.messages;
    if (deltas.review_requests) newValues.review_requests_count += deltas.review_requests;

    await db('usage_monthly')
      .where({ id: row.id })
      .update({
        ...newValues,
        updated_at: db.fn.now()
      });

    ctx.body = { updated: true };
  });

  router.post('/tenants/:tenantId/send-whatsapp', async (ctx: any) => {
      const tenantId = ctx.params.tenantId as string;
      const { restaurantId, to, body, templateId } = ctx.request.body || {};
  
      const tenant = await db('tenants').where({ id: tenantId }).first();
      const restaurant = await db('restaurants').where({ id: restaurantId }).first();
  
      if (!tenant || !restaurant) {
        ctx.status = 404;
        ctx.body = { error: 'TenantOrRestaurantNotFound' };
        return;
      }
  
      const result = await sendWhatsApp({
        credentials: tenant.whatsapp_credentials,
        to,
        body,
        templateId
      });
  
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
        .toISOString()
        .slice(0, 10);
  
      let usage = await db('usage_monthly')
        .where({ tenant_id: tenantId, month_start: monthStart })
        .first();
  
      if (!usage) {
        await db('usage_monthly').insert({
          tenant_id: tenantId,
          month_start: monthStart,
          whatsapp_messages_count: 1
        });
      } else {
        await db('usage_monthly')
          .where({ id: usage.id })
          .update({
            whatsapp_messages_count: usage.whatsapp_messages_count + 1,
            updated_at: db.fn.now()
          });
      }
  
      ctx.body = {
        status: 'sent',
        providerResponse: result
      };
   });

  // Mount the Koa router (cast app to any to access Koa middleware)
  ;(app as Application).use(router.routes()).use(router.allowedMethods())
  

  // Initialize hooks
  app.service(tenantPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(tenantExternalResolver), schemaHooks.resolveResult(tenantResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(tenantQueryValidator), schemaHooks.resolveQuery(tenantQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(tenantDataValidator), schemaHooks.resolveData(tenantDataResolver)],
      patch: [schemaHooks.validateData(tenantPatchValidator), schemaHooks.resolveData(tenantPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [tenantPath]: TenantService
  }
}

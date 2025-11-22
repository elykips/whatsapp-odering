import { feedback } from './feedback/feedback'
import { usage } from './usage/usage'
import { reservation } from './reservations/reservations'
import { review } from './reviews/reviews'
import { restaurant } from './restaurants/restaurants'
import { tenant } from './tenants/tenants'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(feedback)
  app.configure(usage)
  app.configure(reservation)
  app.configure(review)
  app.configure(restaurant)
  app.configure(tenant)
  app.configure(user)
  // All services will be registered here
}

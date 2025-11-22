// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Restaurant,
  RestaurantData,
  RestaurantPatch,
  RestaurantQuery,
  RestaurantService
} from './restaurants.class'

export type { Restaurant, RestaurantData, RestaurantPatch, RestaurantQuery }

export type RestaurantClientService = Pick<
  RestaurantService<Params<RestaurantQuery>>,
  (typeof restaurantMethods)[number]
>

export const restaurantPath = 'restaurants'

export const restaurantMethods: Array<keyof RestaurantService> = ['find', 'get', 'create', 'patch', 'remove']

export const restaurantClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(restaurantPath, connection.service(restaurantPath), {
    methods: restaurantMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [restaurantPath]: RestaurantClientService
  }
}

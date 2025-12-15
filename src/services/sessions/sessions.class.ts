import { KnexService } from '@feathersjs/knex'
import type { Application } from '@feathersjs/koa'
import type { KnexAdapterParams } from '@feathersjs/knex'
import { v4 as uuid } from 'uuid'

export class SessionsService extends KnexService {
  app!: Application

  async setup(app: Application) {
    this.app = app
  }

  async create(
    data: any | any[],
    params?: KnexAdapterParams
  ): Promise<any | any[]> {
    const db = this.app.get('opsDb')

    if (Array.isArray(data)) {
      const sessions = data.map(s => ({
        id: uuid(),
        ...s
      }))

      await db('sessions').insert(sessions)
      return sessions
    }

    const session = {
      id: uuid(),
      ...data
    }

    await db('sessions').insert(session)
    return session
  }
}

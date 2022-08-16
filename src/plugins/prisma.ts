import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

export const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  const db = new PrismaClient()

  await db.$connect()

  server.decorate('db', db)
  server.addHook('onClose', async (server) => {
    await server.db.$disconnect()
  })
})


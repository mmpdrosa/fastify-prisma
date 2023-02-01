import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import jwt from '@fastify/jwt'

import { userRoutes } from './modules/user/user.route'

import { userSchemas } from './modules/user/user.schema'

export const server = Fastify()

async function startServer() {
  try {
    server.register(jwt, { secret: 'supersecret' })

    server.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
        }
      },
    )

    for (const schema of userSchemas) {
      server.addSchema(schema)
    }

    server.register(userRoutes, { prefix: 'api/user' })

    server.get('/health-check', async (request, reply) => {
      try {
        reply.status(200).send()
      } catch (err) {
        reply.status(500).send(err)
      }
    })

    await server.listen({
      port: 3333,
      host: '0.0.0.0',
    })

    console.log('Server running at http://localhost:3333')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

startServer()

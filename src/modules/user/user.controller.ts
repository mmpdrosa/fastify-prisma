import { FastifyReply, FastifyRequest } from 'fastify'
import { server } from '../../server'
import { compareHash } from '../../utils/hash'
import { CreateUserData, LoginData } from './user.schema'
import { createUser, findUserByEmail, findUsers } from './user.service'

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserData }>,
  reply: FastifyReply,
) {
  const { email, name, password } = request.body

  try {
    const user = await createUser({ email, name, password })

    return reply.code(201).send(user)
  } catch (err) {
    return reply.code(500).send(err)
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginData }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const user = await findUserByEmail(email)

  if (!user) {
    return reply.code(401).send({ message: 'Invalid email or password' })
  }

  const passwordMatch = await compareHash(password, user.password)

  if (!passwordMatch) {
    return reply.code(401).send({ message: 'Invalid email or password' })
  }

  const { password: _, ...rest } = user

  return {
    token: server.jwt.sign(rest),
  }
}

export async function listUsersHandler() {
  const users = await findUsers()

  return users
}

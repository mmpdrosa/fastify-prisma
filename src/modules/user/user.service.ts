import { prisma } from '../../lib/prisma'
import { CreateUserData } from './user.schema'
import { createHash } from '../../utils/hash'

export async function createUser({ email, name, password }: CreateUserData) {
  const hash = await createHash(password)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
    },
  })

  return user
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}

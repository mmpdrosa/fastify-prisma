import { compare, genSaltSync, hash } from 'bcryptjs'

export async function createHash(password: string) {
  const salt = genSaltSync()
  console.log(salt)
  const hashPassword = await hash(password, salt)

  return hashPassword
}

export async function compareHash(password: string, hash: string) {
  const success = await compare(password, hash)

  return success
}

import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const user = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  name: z.string().optional(),
}

const createUserSchema = z.object({
  ...user,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const createUserResponseSchema = z.object({
  id: z.string().uuid(),
  ...user,
})

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const loginResponseSchema = z.object({
  token: z.string(),
})

export type CreateUserData = z.infer<typeof createUserSchema>

export type LoginData = z.infer<typeof loginSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
})

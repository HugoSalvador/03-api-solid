import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { gymRoutes } from './http/controllers/gyms/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an exnternal tool like DataDog/NewRelix/Sentry
  }
  return reply.status(500).send({ message: 'Internal server error' })
})

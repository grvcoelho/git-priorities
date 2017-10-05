import forge from 'mappersmith'
import authenticationMiddleware from 'mappersmith/middlewares/basic-auth'
import {
  invoker,
} from 'ramda'
import { resources } from './resources'

const headersMiddleware = headers => () => ({
  request (request) {
    return request.enhance({
      headers,
    })
  },
  response (next) {
    return next()
      .then(invoker(0, 'data'))
      .catch(err => Promise.reject(err.data()))
  },
})

export const getClient = ({ username, token }) => {
  const middlewares = [
    headersMiddleware({
      Accept: 'application/vnd.github.inertia-preview+json',
      'User-Agent': 'venkman',
    }),
    authenticationMiddleware({
      username,
      password: token,
    }),
  ]

  return forge({
    host: 'https://api.github.com',
    middlewares,
    resources,
  })
}

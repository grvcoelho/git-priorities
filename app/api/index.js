const forge = require('mappersmith').default
const authenticationMiddleware = require('mappersmith/middlewares/basic-auth').default
const resources = require('./resources')

const headersMiddleware = headers => () => ({
  request (request) {
    return request.enhance({
      headers,
    })
  },
})

const getClient = ({ username, token }) => {
  const middlewares = [
    headersMiddleware({
      Accept: 'application/vnd.github.inertia-preview+json',
      'User-Agent': 'setlight',
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

exports.getClient = getClient

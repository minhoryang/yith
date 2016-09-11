import GitHub from 'github'
import env from '../../../env.js'

const loginToGithub = async ({ id, body }, config) => {
  const {
    name,
    password
  } = JSON.parse(body)

  const nameParts = name.split('.')
  const username = nameParts[0]
  const otp = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

  const github = new GitHub({
    protocol: config.github.endpoint.protocol,
    host: config.github.endpoint.host,
    pathPrefix: config.github.endpoint.pathPrefix
  })

  github.authenticate({
    type: 'basic',
    username,
    password
  })

  let auth = await github.authorization.getOrCreateAuthorizationForApp({
    scopes: ['user'],
    client_id: config.github.client_id,
    client_secret: config.github.secret,
    note: 'yith private npm registry',
    headers: {
      'X-GitHub-OTP': otp
    }
  })

  if (!auth.token.length) {
    await github.authorization.delete({
      id: auth.id,
      headers: {
        'X-GitHub-OTP': otp
      }
    })

    auth = await github.authorization.create({
      scopes: ['user'],
      client_id: config.github.client_id,
      client_secret: config.github.secret,
      note: 'yith private npm registry',
      headers: {
        'X-GitHub-OTP': otp
      }
    })
  }

  return auth
}

export const handler = async (event, context) => {
  const config = env(context)

  try {
    const { token } = await loginToGithub(event, config)
    return context.succeed({
      ok: true,
      token
    })
  } catch (error) {
    return context.fail(new Error('[401] Unauthorized'))
  }
}

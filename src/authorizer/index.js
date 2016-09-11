import GitHub from 'github'
import env from '../../env.js'

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId

  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []

    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }

  return authResponse
}

export const handler = async ({ authorizationToken }, context) => {
  const { github: githubConfig } = env(context)

  const tokenParts = authorizationToken.split('Bearer ')

  if (tokenParts.length <= 1) {
    return context.succeed(generatePolicy(authorizationToken, 'Deny', '*'))
  }

  const token = tokenParts[1]

  const github = new GitHub({
    protocol: githubConfig.endpoint.protocol,
    host: githubConfig.endpoint.host,
    pathPrefix: githubConfig.endpoint.pathPrefix
  })

  github.authenticate({
    type: 'basic',
    username: githubConfig.client_id,
    password: githubConfig.secret
  })

  try {
    await github.authorization.check({
      client_id: githubConfig.client_id,
      access_token: token
    })
    return context.succeed(
      generatePolicy(token, 'Allow', '*')
    )
  } catch (error) {
    return context.succeed(
      generatePolicy(token, 'Deny', '*')
    )
  }
}

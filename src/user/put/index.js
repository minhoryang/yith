import AWS from 'aws-sdk'
import Promise from 'bluebird'
import fetch from 'node-fetch'

AWS.config.region = process.env.SERVERLESS_REGION

fetch.Promise = Promise

const APIGateway = new Promise.promisifyAll(new AWS.APIGateway())

// TODO: Awaiting AWS to pull their finger out and
// upgrade the aws-sdk for lambdas to the latest version
// before using api keys to secure private registry.
const storeAPIKey = async (key, id) => {
  const params = {
    description: `Auto generated key from yith for ${id}`,
    enabled: true,
    generateDistinctId: false,
    name: id,
    value: key
  }

  try {
    const res = await APIGateway.createApiKeyAsync(params)

    return res
  } catch (error) {
    return { error: error.message }
  }
}

const loginToNPM = async (id, { name, password, email }) => {
  const body = {
    _id: id,
    name,
    password,
    email,
    type: "user",
    roles: [],
    date: new Date()
  }

  const req = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  try {
    const response = await fetch(`${process.env.NPM_REGISTRY}-/user/${id}`, req)
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

export default async (event) => {
  try {
    const user = await loginToNPM(event.id, event.body)
    return user;
    //return await storeAPIKey(user.token, event.id)
  } catch (error) {
    return { error: error.message }
  }
}

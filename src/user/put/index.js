import AWS from 'aws-sdk'
import fetch from 'node-fetch'

const loginToNPM = async ({ id, registry, body }) => {
  const {
    name,
    password,
    email
  } = JSON.parse(body)

  const reqBody = {
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
    body: JSON.stringify(reqBody)
  }

  try {
    const response = await fetch(`${registry}-/user/${id}`, req)
    return await response.json()
  } catch (error) {
    return { error: error.message }
  }
}

export const handler = async (event, context, callback) => {
  return callback(null, await (async () => {
    try {
      return await loginToNPM(event)
    } catch (error) {
      return { error: error.message }
    }
  })())
}

import AWS from 'aws-sdk'
import responses from './responses'
import fetch from 'node-fetch'
import Promise from 'bluebird'

fetch.Promise = Promise

const getLocally = async ({ id, bucket, region }) => {
  const S3 = new Promise.promisifyAll(new AWS.S3({ // eslint-disable-line
    region,
    params: {
      Bucket: bucket
    }
  }))

  const meta = await S3.getObjectAsync({
    Key: `${id}/index.json`
  })
  return JSON.parse(meta.Body.toString())
}

const getFromNPM = async ({ id, registry }) => {
  try {
    const response = await fetch(`${registry}${id}`, {
      headers: {
        accept: 'application/json'
      }
    })

    return await response.json()
  } catch (error) {
    return responses.error(error)
  }
}

export const handler = async (event, context) => {
  try {
    return context.succeed(await getLocally(event))
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      return context.succeed(await getFromNPM(event))
    }
    return context.fail(error)
  }
}

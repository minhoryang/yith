import AWS from 'aws-sdk'
import fetch from 'node-fetch'

const getLocally = async ({ id, bucket, region }) => {
  const S3 = new AWS.S3({
    region,
    params: {
      Bucket: bucket
    }
  })

  const meta = await S3.getObject({
    Key: `${id}/index.json`
  }).promise()

  return JSON.parse(
    meta.Body.toString()
  )
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
    return {
      success: false,
      error: error.message
    }
  }
}

export const handler = async (event, context) => {
  try {
    return context.succeed(
      await getLocally(event)
    )
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      return context.succeed(
        await getFromNPM(event)
      )
    }
    return context.fail(error)
  }
}

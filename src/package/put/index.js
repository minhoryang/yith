import AWS from 'aws-sdk'
import Promise from 'bluebird'

let s3 = null

const getPackage = async (id) => {
  const meta = await s3.getObjectAsync({
    Key: `${id}/index.json`
  })
  return JSON.parse(meta.Body.toString())
}

export const handler = async (event, context, callback) => {
  s3 = new Promise.promisifyAll(new AWS.S3({ // eslint-disable-line
    region: event.region,
    params: {
      Bucket: event.bucket
    }
  }))

  const pkg = JSON.parse(event.body)
  const name = event.id
  const version = pkg['dist-tags']['latest']
  const versionData = pkg['versions'][version]

  let data = {}
  try {
    data = await getPackage(name)
    data['dist-tags'].latest = version
    data['_attachments'][`${name}-${version}.tgz`] = pkg['_attachments'][`${name}-${version}.tgz`]
    data.versions[version] = versionData
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      data = pkg
    }
  }

  try {
    await s3.putObjectAsync({
      Key: `${name}/index.json`,
      Body: JSON.stringify(data)
    })
    return context.succeed({ success: true })
  } catch (error) {
    return context.succeed({
      success: false,
      error
    })
  }
}

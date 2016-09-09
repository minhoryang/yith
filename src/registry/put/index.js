import AWS from 'aws-sdk'
import Promise from 'bluebird'

let s3 = null

const storePackageJson = async ({ name, json }) => {
  await s3.putObjectAsync({
    Key: `${name}/index.json`,
    Body: json
  })
}

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

  return callback(null, await (async () => {
    const pkg = event.body
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

    const opts = {
      name,
      version,
      data: pkg['_attachments'][`${name}-${version}.tgz`]['data'],
      json: JSON.stringify(data)
    }

    try {
      await storePackageJson(opts)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  })())
}

import AWS from 'aws-sdk'

let S3 = null

const getPackage = async (id) => {
  const meta = await S3.getObject({
    Key: `${id}/index.json`
  }).promise()

  return JSON.parse(
    meta.Body.toString()
  )
}

export const handler = async (event, context) => {
  S3 = new AWS.S3({
    region: event.region,
    params: {
      Bucket: event.bucket
    }
  })

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
    await S3.putObject({
      Key: `${name}/index.json`,
      Body: JSON.stringify(data)
    }).promise()

    return context.succeed({
      success: true
    })
  } catch (error) {
    return context.succeed({
      success: false,
      error
    })
  }
}

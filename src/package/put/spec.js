const handlerPath = '../src/package/put/index.js'

const event = {
  v1: {
    id: 'foo-bar-package',
    body: `
      {
        "_id": "foo-bar-package",
        "name": "foo-bar-package",
        "dist-tags": {
           "latest": "1.0.0"
        },
        "versions": {
           "1.0.0": {
              "name": "foo-bar-package",
              "version": "1.0.0"
           }
        },
        "_attachments": {
          "foo-bar-package-1.0.0.tgz": {}
        }
      }
    `
  },
  v2: {
    id: 'foo-bar-package',
    body: `
      {
        "_id": "foo-bar-package",
        "name": "foo-bar-package",
        "dist-tags": {
           "latest": "2.0.0"
        },
        "versions": {
           "2.0.0": {
              "name": "foo-bar-package",
              "version": "2.0.0"
           }
        },
        "_attachments": {
          "foo-bar-package-2.0.0.tgz": {}
        }
      }
    `
  }
}

describe('Package', () => {
  describe('PUT', () => {
    describe('#handler()', () => {
      context('package exists in private registry', () => {
        let subject

        beforeEach(() => {
          spy(mocks.Context, 'succeed')

          stub(mocks.AWS.S3.prototype, 'getObject').returns({
            promise: () => ({
              Body: new Buffer(event.v1.body, 'utf-8')
            })
          })
          stub(mocks.AWS.S3.prototype, 'putObject').returns({
            promise: () => Promise.resolve()
          })

          subject = injectr(handlerPath, {
            'aws-sdk': mocks.AWS
          }, { console }).handler
        })

        afterEach(() => {
          mocks.Context.succeed.restore()
          mocks.AWS.S3.prototype.getObject.restore()
          mocks.AWS.S3.prototype.putObject.restore()
        })

        it('should save correct body from event in private registry', async () => {
          await subject(event.v2, mocks.Context)

          expect(mocks.AWS.S3.prototype.putObject)
            .to.have.been.calledWith({
              Key: 'foo-bar-package/index.json',
              Body: '{"_id":"foo-bar-package","name":"foo-bar-package","dist-tags":{"latest":"2.0.0"},"versions":{"1.0.0":{"name":"foo-bar-package","version":"1.0.0"},"2.0.0":{"name":"foo-bar-package","version":"2.0.0"}},"_attachments":{"foo-bar-package-1.0.0.tgz":{},"foo-bar-package-2.0.0.tgz":{}}}'
            })
        })

        it('should call context succeed with correct response', async () => {
          await subject(event.v2, mocks.Context)

          expect(mocks.Context.succeed)
            .to.have.been.calledWith({
              success: true
            })
        })
      })

      context('package does not exist in private registry', () => {
        let subject

        beforeEach(() => {
          spy(mocks.Context, 'succeed')

          stub(mocks.AWS.S3.prototype, 'getObject').throws({
            code: 'NoSuchKey'
          })
          stub(mocks.AWS.S3.prototype, 'putObject').returns({
            promise: () => Promise.resolve()
          })

          subject = injectr(handlerPath, {
            'aws-sdk': mocks.AWS
          }, { console }).handler
        })

        afterEach(() => {
          mocks.Context.succeed.restore()
          mocks.AWS.S3.prototype.getObject.restore()
          mocks.AWS.S3.prototype.putObject.restore()
        })

        it('should save correct body from event in private registry', async () => {
          await subject(event.v1, mocks.Context)

          expect(mocks.AWS.S3.prototype.putObject)
            .to.have.been.calledWith({
              Key: 'foo-bar-package/index.json',
              Body: '{"_id":"foo-bar-package","name":"foo-bar-package","dist-tags":{"latest":"1.0.0"},"versions":{"1.0.0":{"name":"foo-bar-package","version":"1.0.0"}},"_attachments":{"foo-bar-package-1.0.0.tgz":{}}}'
            })
        })

        it('should call context succeed with correct response', async () => {
          await subject(event.v1, mocks.Context)

          expect(mocks.Context.succeed)
            .to.have.been.calledWith({
              success: true
            })
        })
      })
    })
  })
})

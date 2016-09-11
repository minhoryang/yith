const handlerPath = '../src/package/get/index.js'

const event = {
  id: 'foo-bar-package',
  registry: 'https://example.com/',
  bucket: 'bucket-foo',
  region: 'region-bar'
}

describe('Package', () => {
  describe('GET', () => {
    describe('#handler()', () => {
      context('package does not exist in private registry', () => {
        let subject

        beforeEach(() => {
          stub(mocks.Fetch, 'ok').returns('{ "_id": "foo" }')
          stub(mocks.AWS.S3.prototype, 'getObject').throws({
            code: 'NoSuchKey'
          })

          subject = injectr(handlerPath, {
            'aws-sdk': mocks.AWS,
            'node-fetch': mocks.Fetch.ok
          }).handler
        })

        afterEach(() => {
          mocks.Fetch.ok.restore()
          mocks.AWS.S3.prototype.getObject.restore()
        })

        it('should request package json from npm', async () => {
          await subject(event, mocks.Context)

          expect(mocks.Fetch.ok)
            .to.have.been.calledWith('https://example.com/foo-bar-package', {
              headers: {
                accept: 'application/json'
              }
            })
        })
      })

      context('package exists in private registry', () => {
        let subject

        beforeEach(() => {
          spy(mocks.Fetch, 'ok')
          stub(mocks.AWS.S3.prototype, 'getObject')
            .returns({
              Body: Buffer.from('{}', 'utf-8')
            })

          subject = injectr(handlerPath, {
            'aws-sdk': mocks.AWS,
            'node-fetch': mocks.Fetch.ok
          }).handler
        })

        afterEach(() => {
          mocks.Fetch.ok.restore()
          mocks.AWS.S3.prototype.getObject.restore()
        })

        it('should request package json with correct key', async () => {
          await subject(event, mocks.Context)

          expect(mocks.AWS.S3.prototype.getObject)
            .to.have.been.calledWith({
              Key: 'foo-bar-package/index.json'
            })
        })

        it('should not request package from npm', async () => {
          await subject(event, mocks.Context)

          expect(mocks.Fetch.ok)
            .to.not.have.been.called
        })
      })
    })
  })
})

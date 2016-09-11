const promise =
  () => new Promise()

export default {
  S3: class S3 {
    getObject (params) {
      return { promise }
    }
  }
}

export default {
  ok () {
    return Promise.resolve({
      json: () => Promise.resolve('{ "_id": "foo" }')
    })
  }
}

const error = (error) => ({
  success: false,
  error: error.message
})

export default {
  error
}

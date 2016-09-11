module.exports = function (context) {
  const stage = context.functionName.split('-')[1]
  return require(`.config-${stage}`)
}

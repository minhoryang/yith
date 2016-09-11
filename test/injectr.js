import fs from 'fs'
import injectr from 'injectr'

const babelConfig = JSON.parse(
  fs.readFileSync(`${__dirname}/../.babelrc`, {
    encoding: 'utf-8'
  }
))

injectr.onload = (filename, content) => {
  const transformConfig = Object.assign({ filename }, babelConfig)
  return require('babel-core').transform(content, transformConfig).code
}

export default injectr

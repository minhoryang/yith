import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import chai from 'chai'
import injectr from './injectr'
import {
  Context,
  AWS,
  Fetch
} from './mocks'

global.stub = sinon.stub
global.spy = sinon.stub
global.expect = chai.expect
global.injectr = injectr
global.mocks = {
  Context,
  AWS,
  Fetch
}

chai.use(sinonChai)

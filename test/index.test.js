import { script } from 'lab'
import { expect } from 'code'
import {
  isPlainObject,
  isEqual
} from 'lodash'
import SenecaMergePayload from '../index'
import Mock from './mock'
const lab = exports.lab = script()
const describe = lab.describe
const it = lab.it

describe('Seneca Merge Payload', () => {
  it('Expect merge validate values with requestOptions',
    () => {
      const payload = Mock.payload
      const result = SenecaMergePayload(payload.values, payload)
      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.expected)).to.be.equal(true)
    })
})

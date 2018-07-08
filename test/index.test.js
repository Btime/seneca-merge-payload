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
  it('Expect merge validate with default method and requestOptions',
    () => {
      const payload = Mock.default.payload
      const result = SenecaMergePayload(payload.values, payload)
      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.default.expected)).to.be.equal(true)
    })

  it('Expect merge validate with composed name for an entity when applying ordination',
    () => {
      const payload = Mock.composedNameForAnEntity.payload
      const result = SenecaMergePayload(payload.values, payload)
      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.composedNameForAnEntity.expected))
        .to.be.equal(true)
    })
})

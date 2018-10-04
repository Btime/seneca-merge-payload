/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const { isPlainObject, isEqual } = require('lodash')
const SenecaMergePayload = require('../index')
const Mock = require('./mock')

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

  it('Expect merge validate with filter of date in an association',
    () => {
      const payload = Mock.dateAssociationFilter.payload
      const result = SenecaMergePayload(payload.values, payload)

      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.dateAssociationFilter.expected))
        .to.be.equal(true)
    })
})

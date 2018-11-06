/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const { isPlainObject, isEqual } = require('lodash')
const SenecaMergePayload = require('../index')
const Mock = require('./mock')

describe('Seneca Merge Payload', () => {
  it('Expect not to merge when payload format is invalid', () => {
    const payload = Mock.invalidFormatForPayload.payload
    const result = SenecaMergePayload(payload, payload)

    expect(isEqual(result, Mock.invalidFormatForPayload.expected))
      .to.be.equal(true)
  })

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

  it('Expect to merge desired attributes via "include" option', () => {
    const payload = Mock.attributesWithInclude.payload
    const result = SenecaMergePayload(payload.values, payload)

    expect(isPlainObject(result)).to.be.equal(true)
    expect(isEqual(result, Mock.attributesWithInclude.expected))
      .to.be.equal(true)
  })

  it('Expect to merge attributes considering exclusion via "exclude" option',
    () => {
      const payload = Mock.attributesWithExclude.payload
      const result = SenecaMergePayload(payload.values, payload)

      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.attributesWithExclude.expected))
        .to.be.equal(true)
    })

  it('Expect to consider all but excluded attributes via "exclude" option',
    () => {
      const payload = Mock.attributesWithExcludeOnly.payload
      const result = SenecaMergePayload(payload.values, payload)

      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.attributesWithExcludeOnly.expected))
        .to.be.equal(true)
    })

  it('Expect to merge "include", "exclude" and "fields" options as attributes',
    () => {
      const payload = Mock.attributesWithIncludeAndExclude.payload
      const result = SenecaMergePayload(payload.values, payload)

      expect(isPlainObject(result)).to.be.equal(true)
      expect(isEqual(result, Mock.attributesWithIncludeAndExclude.expected))
        .to.be.equal(true)
    })
})

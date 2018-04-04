import {
  isPlainObject,
  isArray,
  merge,
  uniq,
  keys,
  pick
} from 'lodash'
import Joi from 'joi'
import Schema from './schema'
const PICK_FIELDS = [
  'user',
  'requestOptions'
]
const FILTER_OPERATOR = '$and'
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

export default function SenecaMergePayload (payload, params) {
  const isValid = Joi.validate(pick(params, PICK_FIELDS), Schema)

  if (!isPlainObject(payload) || isValid.error) {
    return payload
  }
  const options = params.requestOptions
  const user = params.user

  if (!isPlainObject(options)) {
    return payload
  }

  if (isArray(options.fields) && options.fields.length) {
    payload = merge(payload, {
      attributes: uniq(
        (payload.attributes || []).concat(options.fields)
      )
    })
  }

  const where = {}

  if (user && user.providerId) {
    where.providerId = user.providerId
  }

  if (isPlainObject(options.filters) && keys(options.filters).length) {
    where[FILTER_OPERATOR] = []
    for (let key in options.filters) {
      let clause = {}
      clause[key] = options.filters[key]
      where[FILTER_OPERATOR].push(clause)
    }
  }

  payload = merge(payload, { where })

  if (isPlainObject(options.paginate)) {
    const page = options.paginate.page || DEFAULT_PAGE
    const limit = options.paginate.limit || DEFAULT_LIMIT
    const offset = limit * (page - 1)
    payload = merge(payload, { limit, offset })
  }

  return payload
}

import {
  isPlainObject,
  isFunction,
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
const AND_FILTER_OP = '$and'
const EQ_FILTER_OP = '$eq'
const LIKE_FILTER_OP = '$like'
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const createWhereClauseGroup = (operator, values) => {
  const group = []
  for (let key in values) {
    const clause = {}
    clause[key] = {}
    clause[key][operator] = values[key]
    group.push(clause)
  }
  return group
}

const defaultMergePayload = (payload, params) => {
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

  const where = { enabled: true, deleted: false }
  where[AND_FILTER_OP] = []

  if (user && user.providerId) {
    where.providerId = user.providerId
  }

  if (isPlainObject(options.filters) && keys(options.filters).length) {
    const group = createWhereClauseGroup(EQ_FILTER_OP, options.filters)
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group)
  }

  if (isPlainObject(options.like) && keys(options.like).length) {
    const group = createWhereClauseGroup(LIKE_FILTER_OP, options.like)
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group)
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

const upsertMergePayload = (payload, params) => {
  const { user } = params

  if (user && user.providerId) {
    payload.providerId = payload.providerId || user.providerId
  }

  return payload
}

const SenecaMergePayload = (payload, params, method = 'default') => {
  const isValid = Joi.validate(pick(params, PICK_FIELDS), Schema)

  if (!isPlainObject(payload) || isValid.error) {
    return payload
  }

  const mergeMap = {
    default: defaultMergePayload,
    upsert: upsertMergePayload
  }
  const caller = mergeMap[method]

  if (!isFunction(caller)) {
    return payload
  }

  return caller(payload, params)
}

export default SenecaMergePayload

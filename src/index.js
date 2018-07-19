import {
  isPlainObject,
  isFunction,
  isArray,
  merge,
  uniq,
  keys,
  get,
  pick,
  clone
} from 'lodash'
import Joi from 'joi'
import Schema from './schema'

const PICK_FIELDS = [
  'user',
  'requestOptions'
]

const OR_FILTER_OP = '$or'
const AND_FILTER_OP = '$and'
const EQ_FILTER_OP = '$eq'
const LIKE_FILTER_OP = '$like'
const IN_FILTER_OP = '$in'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const DEFAULT_ORDINATION_FIELD = 'createdAt'
const DEFAULT_ORDINATION_TYPE = 'DESC'

const transformLikeValue = (value) => {
  return `%${value}%`
}

const transformValueByOperator = (operator, value) => {
  const TRANSFORM_MAP = {
    $like: transformLikeValue
  }
  return TRANSFORM_MAP[operator] && TRANSFORM_MAP[operator](value) || value
}

const getOperatorByValue = (value, operator) => {
  return !isArray(value) && operator || IN_FILTER_OP
}

const createWhereClauseGroup = (operator, values) => {
  const group = []
  for (let key in values) {
    const value = values[key]
    operator = getOperatorByValue(value, operator)
    const clause = {}
    clause[key] = {}
    clause[key][operator] = transformValueByOperator(operator, values[key])
    group.push(clause)
  }
  return group
}

const defaultMergePayload = (payload, params) => {
  const options = params.requestOptions && clone(params.requestOptions)
  const user = params.user && clone(params.user)

  const FILTER_OP_IN_LIKE_CLAUSE = options.likeOperator &&
    options.likeOperator === OR_FILTER_OP.substr(1)
    ? OR_FILTER_OP
    : AND_FILTER_OP

  delete params.requestOptions
  delete params.user

  if (!isPlainObject(options)) {
    return payload
  }

  payload.order = [
    [DEFAULT_ORDINATION_FIELD, DEFAULT_ORDINATION_TYPE]
  ]

  if (isArray(options.fields) && options.fields.length) {
    payload = merge(payload, {
      attributes: uniq(
        (payload.attributes || []).concat(options.fields)
      )
    })
  }
  const enabled = get(payload, 'where.enabled')
  const deleted = get(payload, 'where.deleted')

  const where = {
    enabled: enabled !== undefined ? enabled : true,
    deleted: deleted !== undefined ? deleted : false
  }

  where[AND_FILTER_OP] = []
  where[FILTER_OP_IN_LIKE_CLAUSE] = []

  if (user && user.providerId) {
    where.providerId = user.providerId
  }

  if (isPlainObject(options.filters) && keys(options.filters).length) {
    const group = createWhereClauseGroup(EQ_FILTER_OP, options.filters)
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group)
  }

  if (isPlainObject(options.like) && keys(options.like).length) {
    const group = createWhereClauseGroup(LIKE_FILTER_OP, options.like)
    where[FILTER_OP_IN_LIKE_CLAUSE] = where[FILTER_OP_IN_LIKE_CLAUSE].concat(group)
  }

  payload = merge(payload, { where })

  if (isPlainObject(options.paginate)) {
    const page = options.paginate.page || DEFAULT_PAGE
    const limit = options.paginate.limit || DEFAULT_LIMIT
    const offset = limit * (page - 1)
    payload = merge(payload, { limit, offset })
  }

  if (isPlainObject(options.ordination)) {
    const order = [
      [
        options.ordination.field,
        options.ordination.type
      ]
    ]

    if (options.ordination.field.indexOf('.') >= 0) {
      const pattern = /([a-zA-Z]+).[a-zA-Z]+/
      const entity = options.ordination.field.replace(pattern, '$1')
      order[0].unshift({ entity, as: entity })
    }

    payload = merge(payload, { order })
  }

  return payload
}

const SenecaMergePayload = (payload, params, method = 'default') => {
  const isValid = Joi.validate(pick(params, PICK_FIELDS), Schema)

  if (!isPlainObject(payload) || isValid.error) {
    return payload
  }

  const mergeMap = {
    default: defaultMergePayload
  }

  const caller = mergeMap[method]

  if (!isFunction(caller)) {
    return payload
  }

  return caller(payload, params)
}

export default SenecaMergePayload

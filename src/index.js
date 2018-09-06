import * as _ from 'lodash'
import Joi from 'joi'
import Schema from './schema'

const {
  PICK_FIELDS,
  OR_FILTER_OP,
  AND_FILTER_OP,
  EQ_FILTER_OP,
  BETWEEN_FILTER_OP,
  DATE_KEYS,
  DEFAULT_LIMIT,
  DEFAULT_ORDINATION_FIELD,
  DEFAULT_ORDINATION_TYPE,
  DEFAULT_PAGE,
  IN_FILTER_OP,
  LIKE_FILTER_OP
} = require('./fields')

const SenecaMergePayload = (payload, params, method = 'default') => {
  const isValid = Joi.validate(_.pick(params, PICK_FIELDS), Schema)

  if (!_.isPlainObject(payload) || isValid.error) {
    return payload
  }

  const mergeMap = {
    default: defaultMergePayload
  }

  const caller = mergeMap[method]

  if (!_.isFunction(caller)) {
    return payload
  }

  return caller(payload, params)
}

const defaultMergePayload = (payload, params) => {
  const options = params.requestOptions && _.clone(params.requestOptions)
  delete params.requestOptions

  if (!_.isPlainObject(options)) {
    return payload
  }

  const FILTER_OP_IN_LIKE_CLAUSE = options.likeOperator &&
  options.likeOperator === OR_FILTER_OP.substr(1)
    ? OR_FILTER_OP
    : AND_FILTER_OP

  payload.order = [
    [DEFAULT_ORDINATION_FIELD, DEFAULT_ORDINATION_TYPE]
  ]

  if (_.isArray(options.fields) && options.fields.length) {
    payload = _.merge(payload, {
      attributes: _.uniq(
        (payload.attributes || []).concat(options.fields)
      )
    })
  }
  const enabled = _.get(payload, 'where.enabled')
  const deleted = _.get(payload, 'where.deleted')

  const where = {
    deleted: deleted !== undefined ? deleted : false
  }

  if (enabled !== undefined) {
    where.enabled = enabled
  }

  where[AND_FILTER_OP] = []
  where[FILTER_OP_IN_LIKE_CLAUSE] = []

  if (_.isPlainObject(options.filters) && _.keys(options.filters).length) {
    const group = createWhereClauseGroup(EQ_FILTER_OP, options.filters)
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group)
  }

  if (_.isPlainObject(options.like) && _.keys(options.like).length) {
    const group = createWhereClauseGroup(LIKE_FILTER_OP, options.like)
    where[FILTER_OP_IN_LIKE_CLAUSE] = where[FILTER_OP_IN_LIKE_CLAUSE].concat(group)
  }

  payload = _.merge(payload, { where })

  if (_.isPlainObject(options.paginate)) {
    const page = options.paginate.page || DEFAULT_PAGE
    const limit = options.paginate.limit || DEFAULT_LIMIT
    const offset = limit * (page - 1)
    payload = _.merge(payload, { limit, offset })
  }

  if (_.isPlainObject(options.ordination)) {
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

    payload = _.merge(payload, { order })
  }

  if (params.getAddress) {
    payload.where.userId = params.credentials.id
  }

  return payload
}

const createWhereClauseGroup = (operator, values) => {
  const group = []
  let sequelizeOperator

  for (let key in values) {
    sequelizeOperator = operator

    if (DATE_KEYS.indexOf(key) >= 0) {
      sequelizeOperator = BETWEEN_FILTER_OP
    }

    const value = values[key]
    sequelizeOperator = getOperatorByValue(value, sequelizeOperator)
    const clause = {}
    clause[key] = {}
    clause[key][sequelizeOperator] = transformValueByOperator(
      sequelizeOperator, values[key]
    )
    group.push(clause)
  }

  return group
}

const getOperatorByValue = (value, operator) => {
  if (_.isArray(value) && operator === BETWEEN_FILTER_OP) {
    return operator
  }

  return !_.isArray(value) && operator || IN_FILTER_OP
}

const transformValueByOperator = (operator, value) => {
  const TRANSFORM_MAP = {
    $like: transformLikeValue
  }
  return TRANSFORM_MAP[operator] && TRANSFORM_MAP[operator](value) || value
}

const transformLikeValue = (value) => {
  return `%${value}%`
}

export default SenecaMergePayload

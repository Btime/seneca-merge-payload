import {
  isPlainObject,
  isArray,
  merge,
  uniq,
  keys
} from 'lodash'
const FILTER_OPERATOR = '$and'
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

export default function SenecaMergePayload (payload, options) {
  if (!isPlainObject(payload)) {
    return payload
  }

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

  if (isPlainObject(options.filters) && keys(options.filters).length) {
    const where = {}
    where[FILTER_OPERATOR] = []
    for (let key in options.filters) {
      let clause = {}
      clause[key] = options.filters[key]
      where[FILTER_OPERATOR].push(clause)
    }
    payload = merge(payload, { where })
  }

  if (isPlainObject(options.paginate)) {
    const page = options.paginate.page || DEFAULT_PAGE
    const limit = options.paginate.limit || DEFAULT_LIMIT
    const offset = limit * (page - 1)
    payload = merge(payload, { limit, offset })
  }

  return payload
}

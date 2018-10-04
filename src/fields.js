module.exports.PICK_FIELDS = [
  'requestOptions'
]

module.exports.OR_FILTER_OP = '$or'
module.exports.AND_FILTER_OP = '$and'
module.exports.EQ_FILTER_OP = '$eq'
module.exports.LIKE_FILTER_OP = '$like'
module.exports.IN_FILTER_OP = '$in'
module.exports.BETWEEN_FILTER_OP = '$between'

module.exports.DEFAULT_PAGE = 1
module.exports.DEFAULT_LIMIT = 25

module.exports.DEFAULT_ORDINATION_FIELD = 'createdAt'
module.exports.DEFAULT_ORDINATION_TYPE = 'DESC'

module.exports.DATE_KEYS = [
  'createdAt',
  'updatedAt',
  'lastLogin',
  'refundDate',
  'refundPaidDate',
  'scheduling',
  'startDate',
  'endDate'
]

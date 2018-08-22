'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PICK_FIELDS = ['user', 'requestOptions'];

var OR_FILTER_OP = '$or';
var AND_FILTER_OP = '$and';
var EQ_FILTER_OP = '$eq';
var LIKE_FILTER_OP = '$like';
var IN_FILTER_OP = '$in';
var BETWEEN_FILTER_OP = '$between';

var DEFAULT_PAGE = 1;
var DEFAULT_LIMIT = 25;

var DEFAULT_ORDINATION_FIELD = 'createdAt';
var DEFAULT_ORDINATION_TYPE = 'DESC';

var DATE_KEYS = ['createdAt', 'updatedAt', 'user.last_login', 'refundDate', 'scheduling', 'startDate', 'endDate'];

var SenecaMergePayload = function SenecaMergePayload(payload, params) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';

  var isValid = _joi2.default.validate((0, _lodash.pick)(params, PICK_FIELDS), _schema2.default);

  if (!(0, _lodash.isPlainObject)(payload) || isValid.error) {
    return payload;
  }

  var mergeMap = {
    default: defaultMergePayload
  };

  var caller = mergeMap[method];

  if (!(0, _lodash.isFunction)(caller)) {
    return payload;
  }

  return caller(payload, params);
};

var defaultMergePayload = function defaultMergePayload(payload, params) {
  var options = params.requestOptions && (0, _lodash.clone)(params.requestOptions);
  var user = params.user && (0, _lodash.clone)(params.user);

  delete params.requestOptions;
  delete params.user;

  if (!(0, _lodash.isPlainObject)(options)) {
    return payload;
  }

  var FILTER_OP_IN_LIKE_CLAUSE = options.likeOperator && options.likeOperator === OR_FILTER_OP.substr(1) ? OR_FILTER_OP : AND_FILTER_OP;

  payload.order = [[DEFAULT_ORDINATION_FIELD, DEFAULT_ORDINATION_TYPE]];

  if ((0, _lodash.isArray)(options.fields) && options.fields.length) {
    payload = (0, _lodash.merge)(payload, {
      attributes: (0, _lodash.uniq)((payload.attributes || []).concat(options.fields))
    });
  }

  var enabled = (0, _lodash.get)(payload, 'where.enabled');
  var deleted = (0, _lodash.get)(payload, 'where.deleted');

  var where = {
    deleted: deleted !== undefined ? deleted : false
  };

  if (enabled !== undefined) {
    where.enabled = enabled;
  }

  where[AND_FILTER_OP] = [];
  where[FILTER_OP_IN_LIKE_CLAUSE] = [];

  if (user && user.providerId) {
    where.providerId = user.providerId;
  }

  if ((0, _lodash.isPlainObject)(options.filters) && (0, _lodash.keys)(options.filters).length) {
    var group = createWhereClauseGroup(EQ_FILTER_OP, options.filters);
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group);
  }

  if ((0, _lodash.isPlainObject)(options.like) && (0, _lodash.keys)(options.like).length) {
    var _group = createWhereClauseGroup(LIKE_FILTER_OP, options.like);
    where[FILTER_OP_IN_LIKE_CLAUSE] = where[FILTER_OP_IN_LIKE_CLAUSE].concat(_group);
  }

  payload = (0, _lodash.merge)(payload, { where: where });

  if ((0, _lodash.isPlainObject)(options.paginate)) {
    var page = options.paginate.page || DEFAULT_PAGE;
    var limit = options.paginate.limit || DEFAULT_LIMIT;
    var offset = limit * (page - 1);
    payload = (0, _lodash.merge)(payload, { limit: limit, offset: offset });
  }

  if ((0, _lodash.isPlainObject)(options.ordination)) {
    var order = [[options.ordination.field, options.ordination.type]];

    if (options.ordination.field.indexOf('.') >= 0) {
      var pattern = /([a-zA-Z]+).[a-zA-Z]+/;
      var entity = options.ordination.field.replace(pattern, '$1');
      order[0].unshift({ entity: entity, as: entity });
    }

    payload = (0, _lodash.merge)(payload, { order: order });
  }

  return payload;
};

var createWhereClauseGroup = function createWhereClauseGroup(operator, values) {
  var group = [];
  var sequelizeOperator = void 0;

  for (var key in values) {
    sequelizeOperator = operator;

    if (DATE_KEYS.indexOf(key) >= 0) {
      sequelizeOperator = BETWEEN_FILTER_OP;
    }

    var value = values[key];
    sequelizeOperator = getOperatorByValue(value, sequelizeOperator);
    var clause = {};
    clause[key] = {};
    clause[key][sequelizeOperator] = transformValueByOperator(sequelizeOperator, values[key]);
    group.push(clause);
  }

  return group;
};

var getOperatorByValue = function getOperatorByValue(value, operator) {
  if ((0, _lodash.isArray)(value) && operator === BETWEEN_FILTER_OP) {
    return operator;
  }

  return !(0, _lodash.isArray)(value) && operator || IN_FILTER_OP;
};

var transformValueByOperator = function transformValueByOperator(operator, value) {
  var TRANSFORM_MAP = {
    $like: transformLikeValue
  };
  return TRANSFORM_MAP[operator] && TRANSFORM_MAP[operator](value) || value;
};

var transformLikeValue = function transformLikeValue(value) {
  return '%' + value + '%';
};

exports.default = SenecaMergePayload;
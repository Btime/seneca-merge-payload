'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _require = require('./fields'),
    PICK_FIELDS = _require.PICK_FIELDS,
    OR_FILTER_OP = _require.OR_FILTER_OP,
    AND_FILTER_OP = _require.AND_FILTER_OP,
    EQ_FILTER_OP = _require.EQ_FILTER_OP,
    BETWEEN_FILTER_OP = _require.BETWEEN_FILTER_OP,
    DATE_KEYS = _require.DATE_KEYS,
    DEFAULT_LIMIT = _require.DEFAULT_LIMIT,
    DEFAULT_ORDINATION_FIELD = _require.DEFAULT_ORDINATION_FIELD,
    DEFAULT_ORDINATION_TYPE = _require.DEFAULT_ORDINATION_TYPE,
    DEFAULT_PAGE = _require.DEFAULT_PAGE,
    IN_FILTER_OP = _require.IN_FILTER_OP,
    LIKE_FILTER_OP = _require.LIKE_FILTER_OP;

var SenecaMergePayload = function SenecaMergePayload(payload, params) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';

  var isValid = _joi2.default.validate(_.pick(params, PICK_FIELDS), _schema2.default);

  if (!_.isPlainObject(payload) || isValid.error) {
    return payload;
  }

  var mergeMap = {
    default: defaultMergePayload
  };

  var caller = mergeMap[method];

  if (!_.isFunction(caller)) {
    return payload;
  }

  return caller(payload, params);
};

var defaultMergePayload = function defaultMergePayload(payload, params) {
  var options = params.requestOptions && _.clone(params.requestOptions);
  delete params.requestOptions;

  if (!_.isPlainObject(options)) {
    return payload;
  }

  var FILTER_OP_IN_LIKE_CLAUSE = options.likeOperator && options.likeOperator === OR_FILTER_OP.substr(1) ? OR_FILTER_OP : AND_FILTER_OP;

  payload.order = [[DEFAULT_ORDINATION_FIELD, DEFAULT_ORDINATION_TYPE]];

  if (_.isArray(options.fields) && options.fields.length) {
    payload = _.merge(payload, {
      attributes: _.uniq((payload.attributes || []).concat(options.fields))
    });
  }
  var enabled = _.get(payload, 'where.enabled');
  var deleted = _.get(payload, 'where.deleted');

  var where = {
    deleted: deleted !== undefined ? deleted : false
  };

  if (enabled !== undefined) {
    where.enabled = enabled;
  }

  where[AND_FILTER_OP] = [];
  where[FILTER_OP_IN_LIKE_CLAUSE] = [];

  if (_.isPlainObject(options.filters) && _.keys(options.filters).length) {
    var group = createWhereClauseGroup(EQ_FILTER_OP, options.filters);
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group);
  }

  if (_.isPlainObject(options.like) && _.keys(options.like).length) {
    var _group = createWhereClauseGroup(LIKE_FILTER_OP, options.like);
    where[FILTER_OP_IN_LIKE_CLAUSE] = where[FILTER_OP_IN_LIKE_CLAUSE].concat(_group);
  }

  payload = _.merge(payload, { where: where });

  if (_.isPlainObject(options.paginate)) {
    var page = options.paginate.page || DEFAULT_PAGE;
    var limit = options.paginate.limit || DEFAULT_LIMIT;
    var offset = limit * (page - 1);
    payload = _.merge(payload, { limit: limit, offset: offset });
  }

  if (_.isPlainObject(options.ordination)) {
    var order = [[options.ordination.field, options.ordination.type]];

    if (options.ordination.field.indexOf('.') >= 0) {
      var pattern = /([a-zA-Z]+).[a-zA-Z]+/;
      var entity = options.ordination.field.replace(pattern, '$1');
      order[0].unshift({ entity: entity, as: entity });
    }

    payload = _.merge(payload, { order: order });
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
  if (_.isArray(value) && operator === BETWEEN_FILTER_OP) {
    return operator;
  }

  return !_.isArray(value) && operator || IN_FILTER_OP;
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
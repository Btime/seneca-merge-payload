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
var AND_FILTER_OP = '$and';
var EQ_FILTER_OP = '$eq';
var LIKE_FILTER_OP = '$like';
var IN_FILTER_OP = '$in';

var DEFAULT_PAGE = 1;
var DEFAULT_LIMIT = 25;

var DEFAULT_ORDINATION_FIELD = 'updatedAt';
var DEFAULT_ORDINATION_TYPE = 'DESC';

var transformLikeValue = function transformLikeValue(value) {
  return '%' + value + '%';
};

var transformValueByOperator = function transformValueByOperator(operator, value) {
  var TRANSFORM_MAP = {
    $like: transformLikeValue
  };
  return TRANSFORM_MAP[operator] && TRANSFORM_MAP[operator](value) || value;
};

var getOperatorByValue = function getOperatorByValue(value, operator) {
  return !(0, _lodash.isArray)(value) && operator || IN_FILTER_OP;
};

var createWhereClauseGroup = function createWhereClauseGroup(operator, values) {
  var group = [];
  for (var key in values) {
    var value = values[key];
    operator = getOperatorByValue(value, operator);
    var clause = {};
    clause[key] = {};
    clause[key][operator] = transformValueByOperator(operator, values[key]);
    group.push(clause);
  }
  return group;
};

var defaultMergePayload = function defaultMergePayload(payload, params) {
  var options = params.requestOptions && (0, _lodash.clone)(params.requestOptions);
  var user = params.user && (0, _lodash.clone)(params.user);
  delete params.requestOptions;
  delete params.user;

  if (!(0, _lodash.isPlainObject)(options)) {
    return payload;
  }

  if ((0, _lodash.isArray)(options.fields) && options.fields.length) {
    payload = (0, _lodash.merge)(payload, {
      attributes: (0, _lodash.uniq)((payload.attributes || []).concat(options.fields)),
      order: [[DEFAULT_ORDINATION_FIELD, DEFAULT_ORDINATION_TYPE]]
    });
  }
  var enabled = (0, _lodash.get)(payload, 'where.enabled');
  var deleted = (0, _lodash.get)(payload, 'where.deleted');

  var where = {
    enabled: enabled !== undefined ? enabled : true,
    deleted: deleted !== undefined ? deleted : false
  };

  where[AND_FILTER_OP] = [];

  if (user && user.providerId) {
    where.providerId = user.providerId;
  }

  if ((0, _lodash.isPlainObject)(options.filters) && (0, _lodash.keys)(options.filters).length) {
    var group = createWhereClauseGroup(EQ_FILTER_OP, options.filters);
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(group);
  }

  if ((0, _lodash.isPlainObject)(options.like) && (0, _lodash.keys)(options.like).length) {
    var _group = createWhereClauseGroup(LIKE_FILTER_OP, options.like);
    where[AND_FILTER_OP] = where[AND_FILTER_OP].concat(_group);
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
      var pattern = /([a-zA-Z]+).([a-zA-Z]+)/;
      var entity = options.ordination.field.replace(pattern, '$1');
      var field = options.ordination.field.replace(pattern, '$2');

      order[0].unshift({ entity: entity, as: entity });
      order[0][1] = field;
    }

    payload = (0, _lodash.merge)(payload, { order: order });
  }

  return payload;
};

var upsertMergePayload = function upsertMergePayload(payload, params) {
  var user = params.user;


  if (user && user.providerId) {
    payload.providerId = payload.providerId || user.providerId;
  }

  return payload;
};

var SenecaMergePayload = function SenecaMergePayload(payload, params) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';

  var isValid = _joi2.default.validate((0, _lodash.pick)(params, PICK_FIELDS), _schema2.default);

  if (!(0, _lodash.isPlainObject)(payload) || isValid.error) {
    return payload;
  }

  var mergeMap = {
    default: defaultMergePayload,
    upsert: upsertMergePayload
  };
  var caller = mergeMap[method];

  if (!(0, _lodash.isFunction)(caller)) {
    return payload;
  }

  return caller(payload, params);
};

exports.default = SenecaMergePayload;
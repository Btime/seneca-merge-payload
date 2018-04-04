'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SenecaMergePayload;

var _lodash = require('lodash');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PICK_FIELDS = ['user', 'requestOptions'];
var FILTER_OPERATOR = '$and';
var DEFAULT_PAGE = 1;
var DEFAULT_LIMIT = 25;

function SenecaMergePayload(payload, params) {
  var isValid = _joi2.default.validate((0, _lodash.pick)(params, PICK_FIELDS), _schema2.default);

  if (!(0, _lodash.isPlainObject)(payload) || isValid.error) {
    return payload;
  }
  var options = params.requestOptions;
  var user = params.user;

  if (!(0, _lodash.isPlainObject)(options)) {
    return payload;
  }

  if ((0, _lodash.isArray)(options.fields) && options.fields.length) {
    payload = (0, _lodash.merge)(payload, {
      attributes: (0, _lodash.uniq)((payload.attributes || []).concat(options.fields))
    });
  }

  var where = {};

  if (user && user.providerId) {
    where.providerId = user.providerId;
  }

  if ((0, _lodash.isPlainObject)(options.filters) && (0, _lodash.keys)(options.filters).length) {
    where[FILTER_OPERATOR] = [];
    for (var key in options.filters) {
      var clause = {};
      clause[key] = options.filters[key];
      where[FILTER_OPERATOR].push(clause);
    }
  }

  payload = (0, _lodash.merge)(payload, { where: where });

  if ((0, _lodash.isPlainObject)(options.paginate)) {
    var page = options.paginate.page || DEFAULT_PAGE;
    var limit = options.paginate.limit || DEFAULT_LIMIT;
    var offset = limit * (page - 1);
    payload = (0, _lodash.merge)(payload, { limit: limit, offset: offset });
  }

  return payload;
}
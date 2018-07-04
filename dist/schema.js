'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SORTING_TYPES = ['ASC', 'DESC'];

exports.default = {
  user: _joi2.default.object().optional().description('the user data'),

  requestOptions: _joi2.default.object().keys({
    fields: _joi2.default.alternatives().try(_joi2.default.array().min(1).items(_joi2.default.string(), _joi2.default.number(), _joi2.default.boolean()), _joi2.default.object()).optional().description('the fields to format that means the select clause'),

    filters: _joi2.default.object().optional().min(1).description('\n        the filters to format in query string that means the where clause'),

    like: _joi2.default.object().optional().min(1).description('the filter to use in like operation'),

    paginate: _joi2.default.object().optional().keys({
      page: _joi2.default.number().integer(),
      limit: _joi2.default.number().integer()
    }),

    ordination: _joi2.default.object().keys({
      field: _joi2.default.string().required().description('the field to order by'),

      type: _joi2.default.string().valid(SORTING_TYPES).required().description('the order by type')
    }).optional().description('the ordination to format in query string that means the order clause')
  }).optional().description('the user data')
};
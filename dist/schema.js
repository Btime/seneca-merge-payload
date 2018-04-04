'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  user: _joi2.default.object().optional().description('the user data'),

  requestOptions: _joi2.default.object().keys({
    fields: _joi2.default.alternatives().try(_joi2.default.array().min(1).items(_joi2.default.string(), _joi2.default.number(), _joi2.default.boolean()), _joi2.default.object()).optional().description('the fields to format that means the select clause'),

    filters: _joi2.default.object().optional().min(1).description('\n        the filters to format in query string that means the where clause'),

    paginate: _joi2.default.object().required().keys({
      page: _joi2.default.number().integer(),
      limit: _joi2.default.number().integer()
    })
  }).optional().description('the user data')
};
const BtimeSchemaValidatePackage = require('btime-schema-validate-package')

const validateSchema = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-payload'
})

module.exports = validateSchema.result

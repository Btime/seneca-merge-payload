import * as BtimeSchemaValidatePackage from 'btime-schema-validate-package'

const validateSchema = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-payload'
})

export default validateSchema.result

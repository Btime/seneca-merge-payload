import Joi from 'joi'
export default {
  user: Joi.object()
    .optional()
    .description('the user data'),

  requestOptions: Joi.object().keys({
    fields: Joi.alternatives().try(
      Joi.array()
        .min(1)
        .items(
          Joi.string(),
          Joi.number(),
          Joi.boolean()
        ),
      Joi.object()
    )
      .optional()
      .description('the fields to format that means the select clause'),

    filters: Joi.object()
      .optional()
      .min(1)
      .description(`
        the filters to format in query string that means the where clause`
      ),

    paginate: Joi.object()
      .required()
      .keys({
        page: Joi.number().integer(),
        limit: Joi.number().integer()
      })
  })
  .optional()
  .description('the user data')
}

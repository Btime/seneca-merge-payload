import Joi from 'joi'

const SORTING_TYPES = ['ASC', 'DESC']

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

    like: Joi.object()
      .optional()
      .min(1)
      .description('the filter to use in like operation'),

    paginate: Joi.object()
      .optional()
      .keys({
        page: Joi.number().integer(),
        limit: Joi.number().integer()
      }),

    ordination: Joi.object().keys({
      field: Joi.string()
        .required()
        .description('the field to order by'),

      type: Joi.string()
        .valid(SORTING_TYPES)
        .required()
        .description('the order by type')
    })
      .optional()
      .description('the ordination to format in query string that means the order clause')
  })
  .optional()
  .description('the user data')
}

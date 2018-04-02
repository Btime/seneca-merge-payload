export default {
  payload: {
    values: {
      where: {
        name: 'Felipe Barros Cruz'
      },
      attributes: ['name']
    },
    requestOptions: {
      fields: ['email'],
      filters: {
        email: 'felipebarroscruz@btime.com.br',
        provider: 33
      },
      paginate: {
        page: 1,
        limit: 10
      }
    }
  },
  expected: {
    where: {
      name: 'Felipe Barros Cruz',
      $and: [
        {
          email: 'felipebarroscruz@btime.com.br'
        },
        {
          provider: 33
        }
      ]
    },
    attributes: ['name', 'email'],
    limit: 10,
    offset: 0
  }
}

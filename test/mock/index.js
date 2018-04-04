export default {
  payload: {
    values: {
      where: {
        name: 'Felipe Barros Cruz'
      },
      attributes: ['name']
    },
    user: {
      id: 1,
      name: 'Felipe Barros',
      providerId: 1
    },
    requestOptions: {
      fields: ['email'],
      filters: {
        email: 'felipebarroscruz@btime.com.br'
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
      providerId: 1,
      $and: [
        {
          email: 'felipebarroscruz@btime.com.br'
        }
      ]
    },
    attributes: ['name', 'email'],
    limit: 10,
    offset: 0
  }
}

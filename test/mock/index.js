export default {
  default: {
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
          userId: 1,
          email: ['felipebarroscruz@btime.com.br', 'felipe@btime.com.br']
        },
        like: {
          name: 'Fel',
          provider: 'BTi'
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
        enabled: true,
        deleted: false,
        providerId: 1,
        $and: [
          {
            userId: {
              $eq: 1
            }
          },
          {
            email: {
              $in: ['felipebarroscruz@btime.com.br', 'felipe@btime.com.br']
            }
          },
          {
            name: {
              $like: '%Fel%'
            }
          },
          {
            provider: {
              $like: '%BTi%'
            }
          }
        ]
      },
      attributes: ['name', 'email'],
      limit: 10,
      offset: 0
    }
  },
  upsert: {
    payload: {
      values: {
        name: 'Felipe Barros'
      },
      user: {
        id: 1,
        name: 'Felipe Barros',
        providerId: 1
      },
      requestOptions: {
        paginate: {
          page: 1,
          limit: 10
        }
      }
    },
    expected: {
      name: 'Felipe Barros',
      providerId: 1
    }
  }
}

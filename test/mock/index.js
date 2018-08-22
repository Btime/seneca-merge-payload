export default {
  /**
   * @description: Mock for default befavior
   */
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
          email: ['felipebarroscruz@btime.com.br', 'felipe@btime.com.br'],
          createdAt: ['2018-06-01', '2018-08-01']
        },
        like: {
          name: 'Fel',
          provider: 'BTi'
        },
        likeOperator: 'or',
        paginate: {
          page: 1,
          limit: 10
        }
      }
    },

    expected: {
      where: {
        name: 'Felipe Barros Cruz',
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
            createdAt: {
              $between: ['2018-06-01', '2018-08-01']
            }
          }
        ],
        $or: [
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
      order: [ [ 'createdAt', 'DESC' ] ],
      limit: 10,
      offset: 0
    }
  },

  /**
   * @description: Mock for entity with composed name
   */
  composedNameForAnEntity: {
    payload: {
      values: {
        where: {
          name: 'Felipe Barros Cruz',
          enabled: false
        }
      },
      user: {
        id: 1,
        name: 'Felipe Barros',
        providerId: 1
      },
      requestOptions: {
        filters: {
          updatedAt: ['2018-06-01', '2018-08-01']
        },
        paginate: {
          page: 1,
          limit: 25
        },
        ordination: {
          field: 'customer.name',
          type: 'DESC'
        }
      }
    },

    expected: {
      where: {
        name: 'Felipe Barros Cruz',
        deleted: false,
        enabled: false,
        providerId: 1,
        $and: [
          {
            updatedAt: {
              $between: ['2018-06-01', '2018-08-01']
            }
          }
        ]
      },
      order: [
        [{ entity: 'customer', as: 'customer' }, 'customer.name', 'DESC']
      ],
      limit: 25,
      offset: 0
    }
  }
}

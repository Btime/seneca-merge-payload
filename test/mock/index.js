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
          email: ['felipebarroscruz@btime.com.br', 'felipe@btime.com.br']
        },
        like: {
          name: 'Fel',
          provider: 'BTi'
        },
        paginate: {
          page: 1,
          limit: 10
        },
        ordination: {
          field: 'id',
          type: 'DESC'
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
      order: [ [ 'id', 'DESC' ] ],
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
          name: 'Felipe Barros Cruz'
        }
      },
      user: {
        id: 1,
        name: 'Felipe Barros',
        providerId: 1
      },
      requestOptions: {
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
        enabled: true,
        deleted: false,
        providerId: 1,
        $and: []
      },
      order: [
        [{ entity: 'customer', as: 'customer' }, 'name', 'DESC']
      ],
      limit: 25,
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

export default {
  /**
   * @description: Mock for default befavior
   */
  default: {
    payload: {
      values: {
        where: {
          name: 'Btime Team'
        },
        attributes: ['name']
      },
      requestOptions: {
        fields: ['email'],
        filters: {
          email: ['team@btime.com.br', 'team@btime.io'],
          createdAt: ['2018-06-01', '2018-08-01']
        },
        like: {
          name: 'Tea',
          email: 'btime',
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
        name: 'Btime Team',
        deleted: false,
        $and: [
          {
            email: {
              $in: ['team@btime.com.br', 'team@btime.io']
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
              $like: '%Tea%'
            }
          },
          {
            email: {
              $like: '%btime%'
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
          name: 'Btime Team',
          enabled: true
        }
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
        name: 'Btime Team',
        enabled: true,
        deleted: false,
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

module.exports = {
  /**
   * @description: Mock for default behavior
   */
  default: {
    payload: {
      values: {
        where: {
          name: 'Btime Team'
        },
        attributes: [ 'name' ]
      },
      requestOptions: {
        fields: [ 'email' ],
        filters: {
          email: [ 'team@btime.com.br', 'team@btime.io' ],
          createdAt: [ '2018-06-01', '2018-08-01' ]
        },
        like: {
          name: 'Tea',
          email: 'btime'
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
              $in: [ 'team@btime.com.br', 'team@btime.io' ]
            }
          },
          {
            createdAt: {
              $between: [ '2018-06-01', '2018-08-01' ]
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
      attributes: [ 'name', 'email' ],
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
          updatedAt: [ '2018-06-01', '2018-08-01' ]
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
              $between: [ '2018-06-01', '2018-08-01' ]
            }
          }
        ]
      },
      order: [
        [ { entity: 'customer', as: 'customer' }, 'customer.name', 'DESC' ]
      ],
      limit: 25,
      offset: 0
    }
  },

  /**
   * @description Mock for date filter in an association
   */
  dateAssociationFilter: {
    payload: {
      values: {},
      requestOptions: {
        filters: {
          'entity.createdAt': [ '2018-06-01', '2018-08-01' ]
        }
      }
    },

    expected: {
      where: {
        deleted: false,
        $and: [
          {
            'entity.createdAt': {
              $between: [ '2018-06-01', '2018-08-01' ]
            }
          }
        ]
      },
      order: [ [ 'createdAt', 'DESC' ] ]
    }
  },

  /**
   * @description Mock for payload with a invalid format
   */
  invalidFormatForPayload: {
    payload: [ 'not-a-valid-object' ],
    expected: [ 'not-a-valid-object' ]
  },

  /**
   * @description Mock for payload with desired attributes via "include"
   */
  attributesWithInclude: {
    payload: {
      values: {
        attributes: { include: [ 'email', 'name' ] }
      },
      requestOptions: {
        fields: [ 'nationalRegistration', 'createdAt' ]
      }
    },

    expected: {
      attributes: [ 'email', 'name', 'nationalRegistration', 'createdAt' ],
      order: [ [ 'createdAt', 'DESC' ] ],
      where: { deleted: false, '$and': [] }
    }
  },

  /**
   * @description Mock for payload with unwanted attributes via "exclude"
   */
  attributesWithExclude: {
    payload: {
      values: {
        attributes: { exclude: [ 'password' ] }
      },
      requestOptions: {
        fields: [ 'name', 'email', 'password' ]
      }
    },

    expected: {
      attributes: [ 'name', 'email' ],
      order: [ [ 'createdAt', 'DESC' ] ],
      where: { deleted: false, '$and': [] }
    }
  },

  /**
   * @description Mock for payload with both "include" and "exclude" options
   * for attributes selection
   */
  attributesWithIncludeAndExclude: {
    payload: {
      values: {
        attributes: {
          include: [ 'id', 'name', 'email' ],
          exclude: [ 'password', 'deletedAt', 'deletedBy' ]
        }
      },
      requestOptions: {
        fields: [ 'password', 'name' ]
      }
    },

    expected: {
      attributes: [ 'id', 'name', 'email' ],
      order: [ [ 'createdAt', 'DESC' ] ],
      where: { deleted: false, '$and': [] }
    }
  },

  /**
   * @description Mock for payload with "exclude" option for
   * attribute filtering, with no "fields" at requestOptions
   */
  attributesWithExcludeOnly: {
    payload: {
      values: {
        attributes: { exclude: [ 'email', 'name' ] }
      },
      requestOptions: {
        filters: { email: 'team@btime.io' }
      }
    },

    expected: {
      attributes: { exclude: [ 'email', 'name' ] },
      order: [ [ 'createdAt', 'DESC' ] ],
      where: {
        deleted: false,
        $and: [ { email: { $eq: 'team@btime.io' } } ]
      }
    }
  }
}

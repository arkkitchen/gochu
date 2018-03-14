// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'oven',
      user:     'gochu',
      password: 'testtest',
      host:     'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'oven',
      user:     'gochu',
      password: 'TBD',
      host:     'localhost'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

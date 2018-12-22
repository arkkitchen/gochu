// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'oven',
      user:     'gochu',
      password: 'dummypassword',
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
      password: 'dummypassword',
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

// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'oven_test',
      user:     'gochu',
      password: 'dummypassword',
      host:     'oven-test.citcxlfntzst.us-east-2.rds.amazonaws.com'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  local: {
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
      password: process.env.PASSWORD,
      host:     process.env.HOST
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

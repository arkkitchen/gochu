
exports.up = function(knex, Promise) {
  return knex.schema.createTable('addresses', (table) => {
    table.increments();
    table.string('country').notNullable();
    table.string('street_address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('addresses');
};

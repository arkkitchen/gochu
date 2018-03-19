
exports.up = function(knex, Promise) {
  return knex.schema.createTable('addresses', (table) => {
    table.increments();
    table.integer('user_id');
    table.string('country').notNullable();
    table.string('street_address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip').notNullable();
    table.boolean('shipping');
    table.foreign('user_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('addresses');
};

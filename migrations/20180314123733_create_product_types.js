
exports.up = function(knex, Promise) {
  return knex.schema.createTable('producttypes', (table) => {
    table.increments();
    table.string('type').unique().notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('producttypes');
};

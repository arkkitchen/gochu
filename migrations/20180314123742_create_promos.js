
exports.up = function(knex, Promise) {
  return knex.schema.createTable('promos', (table) => {
    table.increments();
    table.string('code').unique().notNullable().uni;
    table.decimal('value');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('promos');
};


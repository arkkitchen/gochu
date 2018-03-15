
exports.up = function(knex, Promise) {
  return knex.schema.createTable('promos', (table) => {
    table.increments();
    table.string('code').unique().notNullable().uni;
    table.integer('product_id');
    table.decimal('value');
    table.foreign('product_id').references('products.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('promos');
};


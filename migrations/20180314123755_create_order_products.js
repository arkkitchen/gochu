
exports.up = function(knex, Promise) {
  return knex.schema.createTable('orderproducts', (table) => {
    table.integer('order_id').notNullable();
    table.integer('product_id').notNullable();
    table.integer('quantity');
    table.foreign('order_id').references('orders.id');
    table.foreign('product_id').references('products.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orderproducts');
};

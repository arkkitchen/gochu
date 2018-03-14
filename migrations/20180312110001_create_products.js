
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', (table) => {
    table.increments();
    table.string('product').unique().notNullable();
    table.string('sku').unique().notNullable();
    table.string('image');
    table.integer('quantity');
    table.integer('cart');
    table.text('description');
    table.decimal('price');
    table.decimal('sale_price');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};

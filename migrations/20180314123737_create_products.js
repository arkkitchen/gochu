
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', (table) => {
    table.increments();
    table.string('product').unique().notNullable();
    table.string('sku').unique().notNullable();
    table.string('image');
    table.integer('product_type_id');
    table.text('description');
    table.integer('quantity');
    table.decimal('price');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.foreign('product_type_id').references('producttypes.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};

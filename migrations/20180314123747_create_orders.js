
exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders', (table) => {
    table.increments();
    table.string('customer_id').notNullable();
    table.string('payment_id').notNullable();
    table.integer('promo_id');
    table.boolean('fulfilled');
    table.string('tracking_number').unique();
    table.json('shipping_address').notNullable();
    table.json('billing_address').notNullable();
    table.timestamp('purchase_date').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('delivery_date');
    table.foreign('promo_id').references('promos.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders');
};

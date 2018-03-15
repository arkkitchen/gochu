
exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders', (table) => {
    table.increments();
    table.integer('customer_id').notNullable();
    table.integer('payment_id').notNullable();
    table.integer('promo_id');
    table.string('status');
    table.boolean('fulfilled');
    table.string('tracking_number').unique();
    table.integer('shipping_address').notNullable();
    table.integer('billing_address').notNullable();
    table.timestamp('purchase_date').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('delivery_date');
    table.foreign('customer_id').references('customers.id');
    table.foreign('promo_id').references('promos.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders');
};

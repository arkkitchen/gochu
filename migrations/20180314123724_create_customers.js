
exports.up = function(knex, Promise) {
  return knex.schema.createTable('customers', (table) => {
    table.increments();
    table.integer('user_id');
    table.string('sessions_sid');
    table.foreign('user_id').references('users.id');
    table.foreign('sessions_sid').references('sessions.sid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('customers');
};



exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('promos').del()
    .then(function () {
      // Inserts seed entries
      return knex('promos').insert([
        {id: 1, code: 'AAAA', value: 1}
      ]);
    });
};

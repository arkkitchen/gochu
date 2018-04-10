
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'a@a', password: '$2a$10$rFqMjmjJUc7ZbWFsQlopjeXnmITVT5QJTLc4T11zpTfXRZ4hyN1be', first_name: 'a', last_name: 'a', profile_avatar: null, admin: true, last_logged_in: null},
      ]);
    });
};
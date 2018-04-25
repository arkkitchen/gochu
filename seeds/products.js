
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {id: 1, product: 'Go Chu', sku: '111AAA', image: '/images/products/gochu_regular.png', quantity: 100, description: `Taste the coffee that inspired Dave Eggers' newest book.`, price: 9.99},
      ]);
    });
};

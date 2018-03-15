
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {id: 1, product: 'Go Chu', sku: '111AAA', image: '/images/products/bottle1.jpg', quantity: 100, description: `Taste the coffee that inspired Dave Eggers' newest book.`, price: 4.99},
      ]);
    });
};

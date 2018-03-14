
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {id: 1, product: 'Go Chu', sku: '111AAA', image: '/images/products/bottle1.jpg', quantity: 100, cart: null, description: 'good good sauce', price: 4.99, sale_price: 3.99},
        {id: 2, product: 'Linds Test', sku: '111AAC', image: '/images/products/test.jpg', quantity: 50, cart: null, description: 'neat neat sauce', price: 50.99, sale_price: 12.99},
        {id: 3, product: 'Ben Test', sku: '111AAB', image: '/images/products/test2.jpg', quantity: 50, cart: null, description: 'bad bad sauce', price: 50.99, sale_price: 12.99}
      ]);
    });
};

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const _ = require('lodash');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(keySecret);

router.get('/', (req, res, next) => {
  console.log(req.session);
  let shipping = 5.00;
  let data = {
    keyPublishable,
    cart: _.get(req, 'session.cart', []),
    total: _.get(req, 'session.total'),
    total_price: _.get(req, 'session.total_price'),
    shipping: shipping,
    total_cost:_.get(req, 'session.total_price') + shipping
  }

  res.render('partials/cart', data);
});

router.post('/:product_id', (req, res, next) => {
  req.session.cart_amount = 4
  let cart = _.get(req, 'body');
  let total = Number(_.get(cart, 'quantity'));
  cart.total = total;
  req.session.cart = [cart];
  req.session.total_price = total * Number(_.get(cart, 'price'));
  req.session.total = total;
  res.redirect('/cart');
});

router.post('/', (req, res, next) => {
  let products = _.get(req, 'body');
  let ids = _.get(req, 'body.id', []);
  let total = 0;
  let total_price = 0;

  req.session.cart = ids.map((val, i) => {
    obj.quantity = products.quantity[i];
    obj.price = products.price[i];
    obj.product = products.product[i];
    obj.image = products.image[i];
    obj.id = val;
    let price = Number(products.quantity[i]) * Number(products.price[i]);
    obj.total = price;
    total_price += price;
    total += Number(products.quantity[i]);
    return obj;
  });

  req.session.total = total;
  req.session.total_price = total_price;
  res.redirect('/cart');
});

router.post('/charge', (req, res, next) => {
  let amount = 500;
  stripe.customers.create({
    email: req.body.stripeEmail,
   source: req.body.stripeToken
 })
 .then(customer =>
   stripe.charges.create({
     amount,
     description: "Sample Charge",
        currency: "usd",
        customer: customer.id
   }))
  .then(charge => {
    console.log(charge);
    res.render('partials/reciept.pug', {charge})
  });
})

router.get('/charge', (req, res, next) => {
  let shipping = 5.00;
  let data = {
    keyPublishable,
    cart: _.get(req, 'session.cart', []),
    total: _.get(req, 'session.total'),
    total_price: _.get(req, 'session.total_price'),
    shipping: shipping,
    total_cost: _.get(req, 'session.total_price') + shipping,
    stripe_total: Number(_.get(req, 'session.total_price') + shipping) * 100
  }
  res.render('partials/charge', data);
});

module.exports = router;
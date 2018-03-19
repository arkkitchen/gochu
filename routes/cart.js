const _ = require('lodash');
const async = require('async');
const express = require('express');
const router = express.Router();

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require('stripe')(keySecret);

const knex = require('../db/connection');
const utils = require('../lib/utils');

function Addresses(){
  return knex('addresses');
}

function Promos(){
  return knex('promos');
}

router.get('/', (req, res, next) => {
  let data =  _.get(req, 'session');
  data.key = keyPublishable;

  res.render('cart/cart', data);
});

router.post('/promos', (req, res, next) => {
  Promos().where({code: req.body.code}).select().first().then((promo) => {
    console.log(promo);
    let data = _.get(req, 'session');
    if(_.isEmpty(promo)) {
      data.error = 'invalid promo code';
      res.render('cart/cart', data);
    } else {
      data.promo = promo;
      res.render('cart/cart', data);
    }
  });
});

router.post('/:product_id', (req, res, next) => {
  let cart =  _.get(req, 'session.cart', []);
  let exists = _.findIndex(cart, (n) => { return n.id == _.get(req, 'body.id'); });

  if(exists > -1) {
    let newTotal = Number(cart[exists].quantity) + Number(_.get(req, 'body.quantity'))
    cart[exists].quantity = newTotal;
    cart[exists].total = newTotal * _.get(req, 'body.price');
  } else {
    let newItem = _.get(req, 'body');
    newItem.total = Number(_.get(newItem, 'quantity')) * Number(_.get(newItem, 'price'));
    cart.push(newItem);
  };
  req.session.cart = cart;
  req.session.save((err) => {
    res.redirect('/cart');
  });
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
    res.render('cart/reciept.pug', {charge})
  });
});

router.get('/charge', (req, res, next) => {
  // Addresses().join('users', {'users.id': 'addresses.user_id'})
  //   .where({'users.id': _.get(req, 'session.user.id')})
  //   .select().then((addresses) => {
  //     console.log('Addresses: ', addresses);
      let shipping = 5.00;
      let data = _.get(req, 'session');
      let total = _.get(data, 'cart_info.total') + shipping
      data.keyPublishable = keyPublishable;
      data.shipping = shipping;
      data.cart_total = total;
      data.stripe_total = total * 100;

      res.render('cart/charge', data);
    // });
});

router.get('/history', (req, res, next) => {
  res.render('cart/history',  _.get(req, 'session'));
});

module.exports = router;
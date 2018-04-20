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

function Orders(){
  return knex('orders');
}

router.get('/', (req, res, next) => {
  res.render('cart/cart', _.get(req, 'session'));
});

router.get('/shipping', (req, res, next) => {
  res.render('cart/shipping', _.get(req, 'session'));
});

router.post('/shipping', (req, res, next) => {
  //TODO: UPS HERE
  req.session.gc_shipping = req.body;
  req.session.save((err) => {
    res.redirect('/cart/charge');
  });
});

router.post('/promos', (req, res, next) => {
  Promos().where({code: req.body.code}).select().first().then((promo) => {
    if(_.isEmpty(promo)) {
      let data = _.cloneDeep(_.get(req, 'session'));
      _.merge(data, {error: 'invalid promo code'});
      res.render('cart/cart', data);
    } else {
      req.session.promo = promo;
      req.session.save((err) => {
        res.redirect('/cart');
      })
    }
  })
});


//form-encoded parameters to user's server
//POST request with JSON body
//keyPublishable and keySectre
//idenity my account when comm with Stripe

router.post('/charge', (req, res, next) => {
  // let amount = 500;
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
 })
 .then(customer =>
   stripe.charges.create({
     amount: _.get(req, 'session.cart_info.total') * 100,
     description: "Go Chu Sale",
        currency: "usd",
        customer: customer.id
      }))
  .then(charge => {
    //TODO: email receipt
    let data = _.cloneDeep(_.get(req, 'session'));
    _.merge(data, charge);
    console.log("CHARGE: ", data);
    Orders().insert({
      customer_id: _.get(charge, 'customer'),
      payment_id: _.get(charge, 'id'),
      promo_id: _.get(data, 'promo.id'),
      fulfilled: false,
      shipping_address: JSON.stringify(_.get(data, 'gc_shipping')),
      billing_address: JSON.stringify(_.get(charge, 'source'))
    }).then((status) => {
      console.log("DATA: ", data);
      req.session.destroy();
      res.render('cart/reciept.pug', data);
    });
  })
  .catch(err => {
    console.log("Error: ", err);
    res.status(500).send({error: "Purchase Failed"});
  });
});

router.get('/charge', (req, res, next) => {
  // Addresses().join('users', {'users.id': 'addresses.user_id'})
  //   .where({'users.id': _.get(req, 'session.user.id')})
  //   .select().then((addresses) => {
  //     console.log('Addresses: ', addresses);
  let data = _.cloneDeep(_.get(req, 'session'));
  if (!_.get(data, 'gc_shipping')) {
    _.merge(data, {error: 'need shipping address'});
    res.render('cart/shipping', data);
  }

  let shipping = 5.00;
  let vol  = {};
  let total = _.cloneDeep(_.get(data, 'cart_info.gross')) + shipping;
  vol.keyPublishable = keyPublishable;
  vol.shipping = shipping;
  vol.cart_total = total;
  vol.stripe_total = total * 100;

  _.merge(data, vol);

  // if(_.isEmpty(data.user)) {
    //   res.render('cart/charge_guest', data);
  // } else {
    //   res.render('cart/charge_user', data);
  // }
  res.render('cart/charge', data);
    // });
});

router.get('/history', (req, res, next) => {
  res.render('cart/history',  _.get(req, 'session'));
});

router.post('/:product_id', (req, res, next) => {
  let cart =  _.get(req, 'session.cart', []);
  let exists = _.findIndex(cart, (n) => { return n.id == _.get(req, 'body.id'); });

  if(exists > -1 && _.get(req, 'body.update') !== "1") {
    let newTotal = Number(cart[exists].quantity) + Number(_.get(req, 'body.quantity'))
    cart[exists].quantity = newTotal;
    cart[exists].total = newTotal * _.get(req, 'body.price');
  } else if (exists > -1 && _.get(req, 'body.update') === "1") {
    let newTotal = Number(_.get(req, 'body.quantity'))
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

module.exports = router;
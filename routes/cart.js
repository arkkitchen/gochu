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
  let body = req.body;
  req.session.gc_shipping = body;
  req.session.save((err) => {
    stripe.orders.create({
      currency: 'usd',
      items: [
        {
          type: 'sku',
          parent: process.env.SKU,
          quantity: _.get(req, 'session.cart_info.items'),
        },
      ],
      shipping: {
        name: _.get(body, 'first_name'),
        address: {
          line1: _.get(body, 'address'),
          city: _.get(body, 'city'),
          state: _.get(body, 'state'),
          postal_code: _.get(body, 'zip'),
          country: 'US',
        },
      },
    })
    .then(data => {
      let methods = _.get(data, 'shipping_methods', []);
      req.session.shipping_methods = _.sortBy(methods, [function(i) { return i.amount}]);
      req.session.save((err) => {
        res.redirect('/cart/charge');
      });
    });
  });
});

router.post('/shipping/edit', (req, res, next) => {
  let result = [];
  let methods = _.cloneDeep(_.get(req, 'session.shipping_methods', []));
  let goodIndex = _.findIndex(methods, function(i) { return i.id === _.get(req, 'body.shipping')});
  result.push(methods[goodIndex]);
  _.forEach(methods, function(val, i){
    if( i !== goodIndex ) {
      result.push(val);
    }
  });
  console.log("DID IT WORK: ", result);
  req.session.shipping_methods = result;
  req.session.save((err) => {

    res.redirect('/cart/charge');
  })
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
    Orders().insert({
      customer_id: _.get(charge, 'customer'),
      payment_id: _.get(charge, 'id'),
      promo_id: _.get(data, 'promo.id'),
      fulfilled: false,
      cart_info: JSON.stringify(_.merge(_.get(data, 'cart_info'), _.get(data, 'cart'))),
      shipping_address: JSON.stringify(_.get(data, 'gc_shipping')),
      billing_address: JSON.stringify(_.get(charge, 'source'))
    }).then((status) => {
      //send confirmation email
      //send jess email
      //possible UPS integration
      console.log("CHARGE: ", charge);
      res.mailer.send('cart/email-reciept', {
        to: _.get(charge, 'source.name'),
        subject: `Order: ${_.get(charge, 'id')}`,
        data,
      }, (err) => {
        if(err) {
          console.log('Err:', err);
          res.send('error sending email;');
          return;
        }
        req.session.destroy();
        res.render('cart/reciept.pug', data);
      });
    });
  })
  .catch(err => {
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

  let shipping = _.get(_.head(_.get(req, 'session.shipping_methods')), 'amount') / 100;
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
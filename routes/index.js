const _ = require('lodash');
const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

function Products(){
  return knex('products');
}

function Users(){
  return knex('users');
}

router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.get('/products', (req, res, next) => {
  Products().select().then((products) => {
    let cart = _.get(req, 'session.cart');
    let cart_amount = _.get(req, 'session.cart_amount')
    res.render('partials/products', {products, cart, cart_amount});
  })
});

router.get('/products/:product', (req, res, next) => {
  res.render('partials/product', {product: req.params.product})
});

router.get('/recipes', (req, res, next) => {
  res.render('partials/recipes', {});
});

router.get('/blog', (req, res, next) => {
  res.render('partials/blog', {});
});

router.get('/retailers', (req, res, next) => {
  res.render('partials/retailers', {});
});


router.get('/login', (req, res, next) => {
  res.render('partials/login', {});
});

router.post('/login', (req, res, next) => {
  Users().where(req.body).select().then((user) => {
    if(_.isEmpty(user)) {
      res.render('partials/signup', {});
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  })
});

router.get('/signup', (req, res, next) => {
  res.render('partials/signup', {});
});

router.post('/signup', (req, res, next) => {
  // TODO: validate user
  Users().insert(req.body).then((user) => {
    res.redirect('/');
  })
});

module.exports = router;

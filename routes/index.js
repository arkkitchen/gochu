const _ = require('lodash');
const express = require('express');
const router = express.Router();

const utils = require('../lib/utils');
const knex = require('../db/connection');

function Products(){
  return knex('products');
}

router.get('/', (req, res, next) => {
  // cart will always be an array
  // cart_info will always be an object
  // user will always be an object
  req.session.destroy();
  console.log(req.session);
  let data = utils.getSession(req);
  res.render('index', data);
});

router.get('/recipes', (req, res, next) => {
  let data = utils.getSession(req);

  res.render('marketing/recipes', data);
});

router.get('/about', (req, res, next) => {
  let data = utils.getSession(req);

  res.render('marketing/about', data);
});

router.get('/talk', (req, res, next) => {
  let data = utils.getSession(req);

  res.render('marketing/talk', data);
});

router.get('/blog', (req, res, next) => {
  let data = utils.getSession(req);

  res.render('marketing/blog', data);
});

router.get('/faq', (req, res, next) => {
  let data = utils.getSession(req);

  res.render('marketing/faq', data);
});

router.get('/retailers', (req, res, next) => {
  let data = utils.getSession(req);

  res.render('marketing/retailers', data);
});

router.get('/products/:product', (req, res, next) => {
  // TODO: catch err
  Products().where({id: req.params.product}).select().first().then((product) => {
    let data = utils.getSession(req);

    data.product = product;
    res.render('cart/product', data);
  })
});

router.get('/products', (req, res, next) => {
  Products().select().then((products) => {
    let data = utils.getSession(req);

    data.products = products;
    console.log(products);
    res.render('cart/products', data);
  })
});

module.exports = router;

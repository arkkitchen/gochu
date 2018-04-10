const _ = require('lodash');
const express = require('express');
const router = express.Router();

const utils = require('../lib/utils');
const knex = require('../db/connection');

function Products(){
  return knex('products');
}

router.get('/', utils.getSession, (req, res, next) => {
  console.log(req.session);
  // req.session.destroy();
  res.render('index', _.get(req, 'session'));
});

router.get('/recipes', (req, res, next) => {
  res.render('marketing/recipes', _.get(req, 'session'));
});

router.get('/blog', (req, res, next) => {
  res.render('marketing/blog', _.get(req, 'session'));
});

router.get('/about', (req, res, next) => {
  res.render('marketing/about', _.get(req, 'session'));
});

router.get('/contact', (req, res, next) => {
  res.render('marketing/contact', _.get(req, 'session'));
});

router.get('/privacy', (req, res, next) => {
  res.render('marketing/privacy', _.get(req, 'session'));
});

router.get('/faq', (req, res, next) => {
  res.render('marketing/faq', _.get(req, 'session'));
});

router.get('/retailers', (req, res, next) => {
  res.render('marketing/retailers', _.get(req, 'session'));
});

router.get('/privacy', (req, res, next) => {
  res.render('marketing/privacy', _.get(req, 'session'));
});

router.get('/products/:product', (req, res, next) => {
  // TODO: catch err
  Products().where({id: req.params.product}).select().first().then((product) => {
    let data = _.get(req, 'session');
    // let product = product;
    res.render('cart/product', {data, product});
  })
});

router.get('/products', (req, res, next) => {
  Products().select().then((products) => {
    let data = _.cloneDeep(_.get(req, 'session'));
    // let products = products;
    res.render('cart/products', {data, products});
  })
});

module.exports = router;
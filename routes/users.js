const _ = require('lodash');
const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

function Users(){
  return knex('users');
}

router.get('/login', (req, res, next) => {
  res.render('partials/login', {});
});

router.get('/signup', (req, res, next) => {
  res.render('partials/signup', {});
});

router.post('/signup', (req, res, next) => {
  // Users().insert()
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;

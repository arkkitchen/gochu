const _ = require('lodash');
const express = require('express');
const router = express.Router();

const knex = require('../db/connection');
const utils = require('../lib/utils');

function Users(){
  return knex('users');
}

router.get('/logout', (req, res, next) => {
  // TODO: store their cart somewhere for next login
  if (req.session) {
    req.session.destroy((err) => {
      if(err) {
        return next(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {});
});

router.post('/login', (req, res, next) => {
  //TODO reinitialiaze cart
  Users().where({email: req.body.email}).select().first().then((user) => {
    if(_.isEmpty(user)) {
      res.render('auth/signup', {errors: 'User not found'});
    } else {
      let valid = utils.comparePass(req.body.password, user.password);
      if(valid){
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render('auth/signup', {error: 'looks like you dont have an accocunt yet'})
      }
    }
  })
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {});
});

router.post('/signup', (req, res, next) => {
  utils.createUser(req)
  .then((response) => {
    req.session.user = _.head(response);

    res.redirect('/');
  })
  .catch((err) => {
    console.log(err);
    res.render('auth/signup', {error: 'user already exists'});
  })
});

module.exports = router;

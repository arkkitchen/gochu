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
  res.render('auth/login', _.get(req, 'session'));
});

router.post('/login', (req, res, next) => {
  //TODO reinitialiaze cart
  Users().where({email: req.body.email}).select().first().then((user) => {
    if(_.isEmpty(user)) {
      let data = _.get(req, 'session');
      let error = 'User not found';
      res.render('auth/signup', {data, error});
    } else {
      let valid = utils.comparePass(req.body.password, user.password);
      if(valid){
        req.session.user = user;
        if(user.admin) {
          req.session.save((err) => {
            res.redirect('/admin')
          })
        } else {
          req.session.save((err) => {
            res.redirect('/');
          })
        }
      } else {
        let data = _.get(req, 'session');
        let error = 'looks like you dont have an accocunt yet';
        res.render('auth/signup', {data, error});
      }
    }
  })
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', _.get(req, 'session'));
});

router.post('/signup', (req, res, next) => {
  utils.createUser(req)
  .then((response) => {
    req.session.user = _.head(response);

    res.redirect('/');
  })
  .catch((err) => {
    let data = _.get(req, 'session');
    let error = 'looks like you dont have an accocunt yet';
    res.render('auth/signup', {data, error})
  })
});

module.exports = router;

const _ = require('lodash');

const bcrypt = require('bcryptjs');
const knex = require('../db/connection');

const getCartInfo = (cart, promo) => {
  let obj = {};
  obj.items = 0;
  obj.total = 0;
  obj.gross = 0;
  cart.forEach((item) => {
    let itemTotal = Number(item.quantity) * Number(item.price);
    obj.total += itemTotal;
    obj.gross += itemTotal;
    obj.items += Number(item.quantity);
  })
  if (promo && _.get(promo, 'value') < obj.total) {
    obj.gross -= _.get(promo, 'value', 0);
  }
  obj.total = precisionRound(obj.total, 2);
  obj.gross = precisionRound(obj.gross, 2);
  return obj;
};

const precisionRound = (number, precision) => {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

module.exports = {
  comparePass: (userPassword, databasePassword) => {
    return bcrypt.compareSync(userPassword, databasePassword);
  },

  createUser: (req) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);
    return knex('users')
    .insert({
      email: req.body.email,
      password: hash,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }).returning('*');
  },

  requiresAdmin: (req, res, next) => {
    if(_.get(req, 'session.user.admin')) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page');
      err.status = 401;
      return next(err);
    }
  },

  getSession: (req, res, next) => {
    req.session.cart = _.get(req, 'session.cart', []);
    req.session.cart_info = getCartInfo(_.get(req, 'session.cart', []), _.get(req, 'session.promo', false));

    console.log(req.session);
    req.session.save((err) => {
      return next();
    })
  }
};

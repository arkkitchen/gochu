const _ = require('lodash');

const bcrypt = require('bcryptjs');
const knex = require('../db/connection');

const getCartInfo = (cart) => {
  let obj = {};
  obj.items = cart.length;
  obj.total = 0;
  cart.forEach((item) => {
    let itemTotal = Number(item.amount) * Number(item.price);
    obj.total += itemTotal;
  })
  return obj;
};

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

  requiresLogin: (req, res, next) => {
    if(req.session && req.session.userId) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page');
      err.status = 401;
      return next(err);
    }
  },
  getSession: (req) => {
    let obj = {};
    obj.user = _.get(req, 'session.user');
    obj.cart = _.get(req, 'session.cart');
    obj.cart_info = getCartInfo(_.get(req, 'session.cart', []));
    return obj;
  }
};

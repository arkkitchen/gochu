const _ = require('lodash');
const express = require('express');
const router = express.Router();

const knex = require('../db/connection');
const utils = require('../lib/utils');

function requiresLogin(req, res, next) {
  if(req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be loggied in to view this page');
    err.status = 401;
    return next(err);
  }
}

router.get('/', (req, res, next) => {
  res.render('admin/index', {admin: 'true'});
});

module.exports = router;
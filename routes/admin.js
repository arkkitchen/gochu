const _ = require('lodash');
const express = require('express');
const router = express.Router();

const knex = require('../db/connection');
const utils = require('../lib/utils');

router.get('/', (err, req, res, next) => {
  if(err) {
    res.render('/auth/login', { error: 'requires admin access'})
  } else {
    res.render('admin/index', {admin: 'true'});
  }
});

module.exports = router;
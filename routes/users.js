const db = require('../db');
const router = require('express').Router();

module.exports = router;

// the routes!
router.get('/users', (req, res, next) => {
  res.render('users', {

  });
});

router.post('/users', (req, res, next) => {

});

router.put('users/:id', (req, res, next) => {

});

router.delete('users/:id', (req, res, next) => {

});

router.get('users/managers', (req, res, next) => {

});

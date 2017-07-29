const db = require('../db');
const router = require('express').Router();

module.exports = router;

// the routes!
router.get('/', (req, res, next) => {
  res.render('users', {
    users: db.getUsers()
  });
});

router.post('/', (req, res, next) => {

});

router.put('/:id', (req, res, next) => {

});

router.delete('/:id', (req, res, next) => {

});

router.get('/managers', (req, res, next) => {

});

const db = require('../db');
const router = require('express').Router();

module.exports = router;

// the routes!
router.get('/', (req, res, next) => {
  db.getUsers()
    .then(users => {
      res.render('users', {
        nav: 'users',
        users: users
      });
    })
    .catch(err => {
      next(err);
    });
});

// req.body = { name: 'Testy McGee' } // isManager is UNDEFINED
// req.body = { name: 'Testy McGee Sr.', isManager: 'on' }
// if user -> redirect to USERS page
// if manager -> redirect to MANAGERS page
router.post('/', (req, res, next) => {
  db.createUser(req.body)
    .then(() => {
      // console.log('req.body.isManager = ', req.body.isManager);
      if (req.body.isManager) {
        res.redirect('/managers');
      } else {
        res.redirect('/users');
      }
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {

});

router.delete('/:id', (req, res, next) => {

});

router.get('/managers', (req, res, next) => {
  res.render('managers', {
    nav: 'managers',
    users: db.getUsers()
  });
});

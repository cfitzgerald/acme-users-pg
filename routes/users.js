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

// req.body = { name: 'Testy McGee' } // is_manager is UNDEFINED
// req.body = { name: 'Testy McGee Sr.', is_manager: 'on' }
// if user -> redirect to USERS page
// if manager -> redirect to MANAGERS page
router.post('/', (req, res, next) => {
  db.createUser(req.body)
    .then(() => {
      // console.log('req.body.is_manager = ', req.body.is_manager);
      if (req.body.is_manager) {
        res.redirect('/users/managers');
      } else {
        res.redirect('/users');
      }
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  db.updateUser(Number(req.params.id))
    .then(() => {
      res.redirect('/users');
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  db.deleteUser(Number(req.params.id))
    .then(() => {
      res.redirect('/users');
    })
    .catch(err => {
      next(err);
    });
});

router.get('/managers', (req, res, next) => {
  let managersOnly = true;
  db.getUsers(managersOnly)
    .then(managers => {
      res.render('managers', {
        nav: 'managers',
        managers: managers
      });
    })
    .catch(err => {
      next(err);
    });
});

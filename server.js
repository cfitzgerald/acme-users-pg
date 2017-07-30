const bodyParser = require('body-parser');
const db = require('./db');
const express = require('express');
const override = require('method-override');
const morgan = require('morgan');
const path = require('path');
const pug = require('pug');

const app = express();

// middleware
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static('public')); // use the express.static middleware to get express to serve static files in /public
app.use(bodyParser.urlencoded({ extended: false }));
app.use(override('_method')); // use the _method parameter on the url
app.use(morgan('dev')); // good ol' morgan with the 'dev' option

// pug setup
app.set('views', './views'); // set the 'views' val to specify the dir where the templates will be stored
app.set('view engine', 'pug'); // set the 'view engine' val to specify the template library (pug)

// res.locals
app.use((req, res, next) => {
  db.getUsers()
    .then(users => {
      res.locals.userCount = users.length;
      next();
    })
    .catch(err => {
      next(err);
    });
});

app.use((req, res, next) => {
  let managersOnly = true;
  db.getUsers(managersOnly)
    .then(users => {
      res.locals.managerCount = users.length;
      next();
    })
    .catch(err => {
      next(err);
    });
});

// handle the root route
app.get('/', (req, res, next) => {
  res.render('index', {
    nav: 'home'
  });
});

// handle routes to users.js
app.use('/users', require('./routes/users'));

// handle errors
app.use((err, req, res, next) => {
  res.render('error', { error: err });
});

// server setup + db synchronize/seed
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`acme-users-pg listening on ${port}...`);
  db.synchronize()
    .then(() => {
      return db.seed();
    })
    .then(() => {
      return db.getUsers();
    })
    .then(users => {
      console.log('synchronize = ', users);
    });
});

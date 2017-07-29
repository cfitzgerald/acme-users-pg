const bodyParser = require('body-parser');
const db = require('./db');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const pug = require('pug');

const app = express();

// middleware
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static('public')); // use the express.static middleware to get express to serve static files in /public
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev')); // good ol' morgan with the 'dev' option

// pug setup
app.set('views', './views'); // set the 'views' val to specify the dir where the templates will be stored
app.set('view engine', 'pug'); // set the 'view engine' val to specify the template library (pug)

// handle the root route
app.get('/', (req, res, next) => {
  res.send('Root Route!');
});

// handle routes to users.js
app.use('/users', require('./routes/users'));

// server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`acme-users-pg listening on ${port}...`);
});

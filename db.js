const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.connect(err => {
  console.log(err);
});

function query(sql, params) {
  return new Promise((resolve, reject) => {
    client.query(sql, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

// synchronize the database
// function synchronize(cb) { // takes a callback function
//   let sql = require('./seedfile.js');
//   query(sql, null, (err) => {
//     if (err) {
//       return cb(err); // if err, callback with the error
//     }
//     cb(null); // else, callback with nothing
//   });
// }
function synchronize() {
  let sql = `
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE,
      isManager BOOLEAN
    );
  `;
  return query(sql);
}

function seed() {
  return Promise.all([
    createUser({ name: 'Hans Tanager', isManager: 'true' }),
    createUser({ name: 'Gretta Muser', isManager: 'false' }),
    createUser({ name: 'Shrimply Pibbles', isManager: 'true' }),
    createUser({ name: 'The Best User', isManager: 'false' }),
    createUser({ name: 'The Very Best User', isManager: 'false' }),
  ])
  .then(result => {
    console.log('seed result = ', result);
  });
}

// function getUsers(cb) {
//   let sql = `
//     SELECT id, name, isManager
//     FROM users
//   `;
//   query(sql, null, (err, result) => {
//     if (err) {
//       return cb(err);
//     }
//     console.log('result = ', result.row);
//     cb(null, result.rows);
//   });
// }
function getUsers() {
  return query('SELECT * FROM users WHERE isManager = FALSE', null)
    .then(result => {
      // console.log('getUsers() result.rows = ', result.rows);
      return result.rows;
    });
}

function createUser(user) {
  return query('INSERT INTO users (name, isManager) VALUES ($1, $2) RETURNING id', [ user.name, user.isManager ])
    .then(result => {
      // console.log('result.rows = ', result.rows);
      return result.rows[0].id;
    });
}

module.exports =  {
  createUser: createUser,
  getUsers: getUsers,
  seed: seed,
  synchronize: synchronize
};

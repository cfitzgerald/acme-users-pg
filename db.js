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

// // synchronize the database
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
      is_manager BOOLEAN
    );
  `;
  return query(sql);
}

function seed() {
  return Promise.all([
    createUser({ name: 'Hans Tanager', is_manager: 'true' }),
    createUser({ name: 'Gretta Muser', is_manager: 'false' }),
    createUser({ name: 'Shrimply Pibbles', is_manager: 'true' }),
    createUser({ name: 'The Best User', is_manager: 'false' }),
    createUser({ name: 'The Very Best User', is_manager: 'false' }),
  ])
  .then(result => {
    console.log('seed result = ', result);
  });
}

// function getUsers(cb) {
//   let sql = `
//     SELECT id, name, is_manager
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
function getUsers(managersOnly) {
  if (!managersOnly) {
    return query('SELECT * FROM users', null)
      .then(result => {
        // console.log('getUsers() result.rows.name = ', result.rows[0].name);
        return result.rows;
      });
  } else {
    return query('SELECT * FROM users WHERE is_manager = TRUE', null)
      .then(result => {
        // console.log('getUsers() result.rows.name = ', result.rows[0].name);
        return result.rows;
      });
  }
}

function getUser(id) {
  return query('SELECT * FROM users WHERE user.id = $1', [ id ])
    .then(result => {
      //console.log('getUser() result.rows = ', result.rows);
      return result.rows;
    });
}

// req.body = { name: 'Testy McGee' }
// req.body = { name: 'Testy McGee Sr.', is_manager: 'on' }
function createUser(user) {
  // console.log('user = ', user);
  // console.log('user.is_manager = ', user.is_manager);
  // if (!user.is_manager) {
  //   user.is_manager = 'false';
  // } else {
  //   user.is_manager = 'true'; // 'on' IS a valid literal value for 'true' in PG, but I'm forcing it to be 'true'
  // }
  // console.log('is_manager? ', user.is_manager);
  return query('INSERT INTO users (name, is_manager) VALUES ($1, $2) RETURNING id', [ user.name, user.is_manager ])
    .then(result => {
      // console.log('createUser() result.rows = ', result.rows);
      return result.rows[0].id;
    });
}

function deleteUser(id) {
  // console.log('id = ' + id + ' (typoef id = ' + typeof id + ')');
  return query('DELETE FROM users WHERE users.id = $1', [ id ]);
}

function updateUser(id) {
  return query('UPDATE users SET is_manager = TRUE WHERE id = $1', [ id ]);
}

module.exports =  {
  createUser: createUser,
  deleteUser: deleteUser,
  getUsers: getUsers,
  seed: seed,
  synchronize: synchronize,
  updateUser: updateUser
};

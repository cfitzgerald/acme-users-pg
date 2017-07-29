const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.connect(err => {
  console.log(err);
});

function query(sql, params, cb) {
  client.query(sql, params, cb);
}

// synchronize the database
function synchronize(cb) { // takes a callback function
  let sql = require('./seedfile.js');
  query(sql, null, function(err) {
    if (err) {
      return cb(err); // if err, callback with the error
    }
    cb(null); // else, callback with nothing
  });
}

module.exports =  {
  synchronize: synchronize
};

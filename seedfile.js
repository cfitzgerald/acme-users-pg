const sql = `

DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(255) UNIQUE,
  isManager BOOLEAN
);

INSERT INTO users (name, isManager) VALUES ('Hans Tanager', TRUE);
INSERT INTO users (name, isManager) VALUES ('Gretta Muser', FALSE);
INSERT INTO users (name, isManager) VALUES ('Shrimply Pibbles', TRUE);
INSERT INTO users (name, isManager) VALUES ('The Best User', FALSE);
INSERT INTO users (name, isManager) VALUES ('The Very Best User', FALSE);

`;

// export
module.exports = sql;

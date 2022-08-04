const mariadb = require('mariadb');
const config = require('./config');

const pool = mariadb.createPool({
  host: config.getHost(),
  user: config.getDBUser(),
  password: process.env.DB_PASSWORD,
  database: config.getDatabase(),
  bigIntAsNumber: true,
});

module.exports = pool;

require('dotenv').config({ path: '../../.env' });

const getHost = () => {
  const host = process.env.HOST;
  if (!host) {
    throw new Error('HOST not defined');
  }
  return host;
};
const getDBUser = () => {
  const dbUser = process.env.DB_USER;
  if (!dbUser) {
    throw new Error('DB_USER not defined');
  }
  return dbUser;
};

const getDBPassword = () => {
  const dbPassword = process.env.DB_PASSWORD;
  if (!dbPassword) {
    throw new Error('DB_PASSWORD not defined');
  }
  return dbPassword;
};

const getDatabase = () => {
  const database = process.env.DATABASE;
  if (!database) {
    throw new Error('DB_NAME not defined');
  }
  return database;
};

const getJwtSecret = () =>
  process.env.JWT_SECRET = 'jiwchoijaesjeonyubchoiyoyoo';

const getDevDatabase = () => {
  const database = process.env.DEV_DATABASE;
  if (!database) {
    throw new Error('DEV DB_NAME not defined');
  }
  return database;
};

module.exports = {
  getHost,
  getDBUser,
  getDBPassword,
  getDatabase,
  getJwtSecret,
  getDevDatabase,
};

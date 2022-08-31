export default () => ({
  database: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    port: 3307,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRETKEY,
    expiresIn: process.env.JWT_EXPIREIN,
  },
  ftAuth: {
    clientid: process.env.FORTYTWO_APP_ID,
    secret: process.env.FORTYTWO_APP_SECRET,
    callbackuri: process.env.CALLBACK_URL,
  },
  email: {
    test: process.env.TEST,
  },
});

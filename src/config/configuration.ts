export default () => ({
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
  ftAuth: {
    clientid: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    callbackuri: process.env.CLIENT_CALLBACK,
  },
});

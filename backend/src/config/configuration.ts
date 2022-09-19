export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_V2,
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
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
    tls: {
      maxVersion: process.env.MAIL_TLS_MAXVERSION,
      minVersion: process.env.MAIL_TLS_MINVERSION,
      ciphers: process.env.MAIL_TLS_CIPHERS,
    },
  },
});

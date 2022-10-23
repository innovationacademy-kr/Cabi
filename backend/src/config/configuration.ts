export default () => ({
  port: parseInt(process.env.PORT, 10),
  is_local: process.env.LOCAL === 'true',
  test: process.env.TEST === 'true',
  database: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT, 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    databaseV2: process.env.DATABASE_V2,
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

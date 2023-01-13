export default () => ({
  fe_host: process.env.FE_HOST,
  port: parseInt(process.env.PORT, 10),
  is_local: process.env.LOCAL === 'true' ? true : false,
  debug: {
    mail_send: process.env.MAIL_SEND === 'true' ? true : false,
    log: process.env.DEBUG_LOG === 'true' ? true : false,
  },
  database: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT, 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    database_v4: process.env.DATABASE_V4,
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
  lent_term: {
    private: parseInt(process.env.LENT_TERM_PRIVATE, 10),
    share: parseInt(process.env.LENT_TERM_SHARE, 10),
  },
  expire_term: {
    soonoverdue: parseInt(process.env.EXPIRE_TERM_SOONOVERDUE, 10),
    overdue: parseInt(process.env.EXPIRE_TERM_OVERDUE, 10),
    lastoverdue: parseInt(process.env.EXPIRE_TERM_LASTOVERDUE, 10),
    forcedreturn: parseInt(process.env.EXPIRE_TERM_FORCEDRETURN, 10),
  },
  admin: {
    clientid: process.env.ADMIN_GOOGLE_CLIENT_ID,
    secret: process.env.ADMIN_GOOGLE_CLIENT_SECRET,
    callbackurl: process.env.ADMIN_GOOGLE_CLIENT_CALLBACK,
  },
  penalty_day_share: parseInt(process.env.PENALTY_DAY_SHARE, 10),
});

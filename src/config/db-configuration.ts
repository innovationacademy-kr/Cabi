export default () => ({
  database: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT, 10),
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  },
});

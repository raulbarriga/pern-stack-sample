import pg from 'pg'

// The port is the default one, the database is the name of it
const pool = new pg.Pool({
  user: "postgres",
  password: process.env.POSTGRES_PSWD,
  host: "localhost",
  database: "pern-todo-app",
  port: 5432
});

export default pool;
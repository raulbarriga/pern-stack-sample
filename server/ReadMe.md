To set up Postgres database in the backend,

- Create a file like `database.sql`
- run this command in the terminal (you should've already installed Postgres): `psql -U postgres`
--  capital U stands for user & postgres mean super admin access to everything inside postgres

- Follow [this guide](https://postgresapp.com/) to install Postgres.
- Once inside `postgres` (the terminal cursor'll start with postgres, which is the name of the db), type `\l` for a list of all the databases in your computer
- To move into a database: `\c <database name>`, e.g. `\c pern-todo-app`

- To create a database: CREATE DATABASE <db-name>; e.g. (CREATE DATABASE "pern-todo-app";)
-- Don't forget the semicolon at the end of a sql script command.
- To see the relationships of your db: `\dt` (there won't be any when you first create a db.)
- Go into your new db: `\c <new-db-name>`

- You have to create a db schema from your db in the terminal: e.g.
    <!--- SERIAL PRIMARY KEY makes the ids unique (SERIAL increments each #) --->
    CREATE TABLE todo(
        todo_id SERIAL PRIMARY KEY,
        description TEXT
    );
- Next, to create your db with your server:
-- Make sure you installed the `pg` package in your server (`npm i pg`).

You need to connect your database
- Use the `pg` package for that
- Configure it like so:
    <!-- In a separate file (i.e. /config/db.js) -->
    import pg from 'pg'

    <!--  port is the default one Postgres one (5432)  -->
    <!-- user is the one you used to connect Postgres, password is that user's password -->
    <!-- database is the name of it, host is just "localhost" -->
    const pool = new pg.Pool({
        user: "postgres",
        password: process.env.POSTGRES_PSWD,
        host: "localhost",
        database: "pern-todo-app",
        port: 5432
    });

    export default pool;

- Import this pool file into your controller(s), where you write your route logic
- To create a new item from your schema (e.g. todo schema), you can do like so:

    export const createTodo = async (req, res) => {
        try {
            <!-- the whole todo -->
            const { description } = req.body;
            `$1` <!--  It's a variabe for what value you put after it inside [variableName] (e.g. [description]) -->
            `RETURNING *` <!--  Outputs the data back (not using it will still add it to the db though) -->
            `INSERT INTO tableName (columnTypeToAdd) VALUES ($1)` <!--  Creates a new data entry -->

            const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
            );
            
            <!-- status 201 = new creation successful -->
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    };

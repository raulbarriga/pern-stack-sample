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
    <!-- Controller for todos route POST request -->
    export const createTodo = async (req, res) => {
        try {
            <!-- the whole todo -->
            const { description } = req.body;
            <!-- `$1` Is a variabe for what value you put after it inside [variableName] (e.g. [description]) -->
            <!-- `RETURNING *` Outputs the data back (not using it will still add it to the db though) -->
            <!-- `INSERT INTO tableName (columnTypeToAdd) VALUES ($1)` Creates a new data entry -->
            <!-- DO NOT USE ANY SORT OF STRING CONCACTINATION INSIDE .query(), it creates SQL injection security vulnerability -->
            <!-- Instead, use $1, $2, where each $# represents a variable to be included in the [] afterwards -->
            const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]);
            
            <!-- status 201 = new creation successful -->
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    };

- To fetch all created todo's:
    export const getTodos = async (req, res) => {
    try {
        <!-- You could also select something else from the columns instead of all columns (*) -->
        const allTodos = await pool.query("SELECT * FROM todo");

        res.status(200).json(allTodos.rows);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
    };

- To edit a todo:
    export const editTodo = async (req, res) => {
        try {
            const { id } = req.params;
            const { description } = req.body;

            <!-- check if id row exists first -->
            const exists = await pool.query(
            "SELECT EXISTS(SELECT 1 FROM todo WHERE todo_id = $1)",
            [id]
            );
            
            if (!exists) return res.status(400).send(`No post with id: ${id}`);

            const editedTodo = await pool.query(
            "Update todo SET description = $1 WHERE todo_id = $2",
            [description, id]
            );

            res.status(200).json(editedTodo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        };

- To delete a todo:
    export const deleteTodo = async (req, res) => {
        try {
            const { id } = req.params;

            <!-- check if id row exists first -->
            const exists = await pool.query(
            "SELECT EXISTS(SELECT 1 FROM todo WHERE todo_id = $1)",
            [id]
            );
            
            // return success code if id doesn't exist (client wanted the id gone & it is)
            if (!exists)
            return res.status(204).json({ message: "Successfully deleted." });

            await pool.query("DELETE FROM todo WHERE id = $1", [id]);
            
            // 204 = success code that doesn't return any content
            res.status(204).json({ message: "Successfully deleted." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        };
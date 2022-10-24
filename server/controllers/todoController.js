import pool from "../config/db.js"; // for connecting db

export const getTodos = async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");

    res.status(200).json(allTodos.rows);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { description } = req.body; // the whole todo
    // $1 is a variabe for what value you put after it inside [] e.g. [description]
    // RETURNING * will output the data back (not using it will still add it to the db though)
    // INSERT INTO tableName (columnTypeToAdd) VALUES ($1) to create new data
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    //status 201 means new creation successful
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const editTodo = async (req, res) => {
  
    const { id } = req.params;
    const { description } = req.body; // the whole todo

    // check if id row exists first
    // try {
      await pool.query("BEGIN");
      const query = await pool.query(
        `
        -- SELECT 1 FROM todo WHERE todo_id = $1
        DO
$do$
BEGIN
   IF EXISTS (SELECT FROM orders) THEN
      DELETE FROM orders;
   ELSE
      INSERT INTO orders VALUES (1,2,3);
   END IF;
END
$do$
        `,
        [id]
      );
      IF condition 
THEN statement; 
END IF;ÏÏ

DO
$do$
BEGIN
   IF EXISTS (SELECT FROM orders) THEN
      DELETE FROM orders;
   ELSE
      INSERT INTO orders VALUES (1,2,3);
   END IF;
END
$do$

      if (!exists) res.status(400).json({message: "Id not found"});
      // console.log("does post id exists? (Inside edit)", exists);
      res.status(200).json(exists);
      
    // } catch (error) {
    //   console.log(error)
    // }
    // if (!exists) res.status(400).send(`No post with id: ${id}`);

    // --const editedTodo = await pool.query(
    //   "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
    //   [description, id]
    // );

    // returns the edited todo (can also returning nothing @ all, depending on developer)
    // --res.status(200).json(editedTodo.rows[0]);
  // } catch (error) {
    // res.status(500).json({ message: error.message });
  // }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // check if id row exists first
    const exists = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM todo WHERE todo_id = $1)",
      [id]
    );
    console.log("does post id exists? (Inside edit)", exists);
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

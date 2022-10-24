import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// for connecting db
import pool from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/todos", todoRoutes);

app.use((req, res) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

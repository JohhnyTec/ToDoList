const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.use(cors());
app.use(bodyParser.json());

app.get('/data', async (req, res) => {
    const result = await pool.query('SELECT * FROM "TaskList"');
    res.json({data:result.rows});
});

app.post('/add', async (req, res) => {
    const task = req.body.tasks;
    if (task) {
      try {
        const result = await pool.query(
          'INSERT INTO "TaskList" (tasks) VALUES ($1) RETURNING id, tasks',
          [task]
        );
        if (result.rows.length > 0) {
          res.json(result.rows[0]);
        } else {
          res.status(500).json({error: "Failed to retrieve inserted data."})
        }
      } catch (err) {
        console.error("Error inserting task:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(400).json({ error: "Task data is missing" });
    }
});

app.post('/done/:index', async (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0) {
      try {
        const result = await pool.query('SELECT "Done" FROM "TaskList" WHERE id = ($1)', [index]);
        if (result.rows.length > 0) {
          const currentDoneValue = result.rows[0].Done;
          const newDoneValue = !currentDoneValue;
          await pool.query('UPDATE "TaskList" SET "Done" = ($1) WHERE id = ($2)', [newDoneValue, index]);
          res.json({ message: "Task status updated!", done: newDoneValue });
        } else {
          res.status(404).json({ error: 'Task not found' });
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(400).json({ error: 'Index invalid' });
    }
  });

app.delete('/deletethis/:index', (req,res)=>{
    const index = parseInt(req.params.index);
    if(index>=0){
      pool.query('DELETE FROM "TaskList" WHERE id=($1)',[index], (err) =>{
        if(err){return console.error(err.message)}
        res.json({message: 'Task is deleted'})
      })
    } else {res.status(400).json({error: 'Index Not Found to delete'})}
})

app.post('/del', async (req, res) => {
    try {
      await pool.query('DROP TABLE IF EXISTS "TaskList"');
      await pool.query(
        `CREATE TABLE IF NOT EXISTS "TaskList" (
          id SERIAL PRIMARY KEY,
          tasks TEXT,
          "Done" BOOLEAN DEFAULT FALSE
        )`
      );
      res.json({ message: "Table deleted and recreated" });
    } catch (err) {
      console.error("Error deleting/creating table:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.listen(5000, "localhost", () => {
    console.log("Server is running on PORT:5000")
});
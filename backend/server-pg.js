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
    const result = await pool.query('SELECT * FROM TaskList');
    res.json(result.rows);
});

app.post('/add', async (req, res) => {
    const task = reg.body.tasks;
    const result = await pool.query('INSERT INTO TaskList (tasks) VALUES ($1)', [task])
    console.log(result.rows)
    res.json({data:result.rows})
});

app.listen(5000, "localhost", () => {
    console.log("Server is running on PORT:5000")
});
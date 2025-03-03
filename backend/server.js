const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.todoList('./todoList.db');

app.use(express.json());

app.get('/data', (req, res) => {
  db.all('SELECT * FROM table_name', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


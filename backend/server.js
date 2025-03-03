const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todoList.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('DatabaseConnection: 200');
});

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

app.listen(PORT, () => {
  console.log('Server is running on port '+ PORT);
});


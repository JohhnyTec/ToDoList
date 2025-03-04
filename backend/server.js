const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todoList.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('DatabaseConnection: 200');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS TaskList (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tasks TEXT,
    Done BOOLEAN DEFAULT FALSE
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('TableExist: 200');
  });
});

app.get('/data', (req, res) => {
  db.all('SELECT tasks,Done FROM TaskList', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.get('/add/:task', (reg,res)=>{
  const task = reg.params.task;
  if(task){
    db.run(
      'INSERT INTO TaskList (tasks) VALUES (?)',
      [task],
      function (err) {
        if(err){
          return console.error(err.message);
        }
      }
    )
    res.json({message: "Mission cleared"});
  }
  else{
    res.status(404).json({error: "Mission failed"})
  }
})

app.get('/done/:index', (req,res)=>{
  const index = parseInt(req.params.index)+1;
  console.log(index);
  if(index>=0){
    db.run(
      'UPDATE TaskList SET Done = 1 WHERE id = (?)',[index],
      function(err){
        if(err){
          return console.error(err.message)
        }
      }
    )
    res.json({message: "Task is Done!"})
    console.log('Done');
  }
})

app.listen(PORT, () => {
  console.log('Server is running on port '+ PORT);
});


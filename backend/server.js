const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

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
  db.all('SELECT id,tasks,Done FROM TaskList', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.post('/add', (reg,res)=>{
  const task = reg.body.tasks;
  if(task){
    db.run(
      'INSERT INTO TaskList (tasks) VALUES (?)',
      [task],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM TaskList WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(row);
        });
      }
    );
  } else{
    res.status(400).json({error: "Mission failed"})
  }
})

app.post('/done/:index', (req,res)=>{
  const index = parseInt(req.body.index);
  if(index>=0){
    db.get('SELECT Done FROM TaskList WHERE id = (?)',[index], (err,row)=> {
        if(err){
          return console.error(err.message);
        }
        if (row){
          const newDoneValue = row.Done === 1 ? 0 : 1;
            db.run('UPDATE TaskList SET Done = (?) WHERE id = (?)',[newDoneValue,index], function(err){
              if(err){
                return console.error(err.message)
              }
              res.json({message: "Task is Done!",done: newDoneValue});
            });
        } else {
          res.status(404).json({error: 'Task not found'});
          }
    });
  } else {
    res.status(400).json({error: 'Index invalid'});
  }
});

app.delete('/deletethis/:index', (req,res)=>{
  const index = parseInt(req.params.index);
  if(index>=0){
    db.run('DELETE FROM TaskList WHERE id=(?)',[index], (err) =>{
      if(err){return console.error(err.message)}
      res.json({message: 'Task is deleted'})
    })
  } else {res.status(400).json({error: 'Index Not Found to delete'})}
});

app.post('/del', (req,res)=>{
  db.run('DROP TABLE TaskList')
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS TaskList (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tasks TEXT,
      Done BOOLEAN DEFAULT FALSE
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });
  res.json({message: "Table deleted"})
}

)

app.listen(PORT, () => {
  console.log('Server is running on port '+ PORT);
});


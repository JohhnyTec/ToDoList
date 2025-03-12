const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4001;
app.use(cors());
app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('restaurant.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('DatabaseConnection: 200');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS foodlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foodname TEXT
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('TableExists: 200');
    });
  }
);

function addElement(thisElement){
    db.get('SELECT * FROM foodlist WHERE foodname = (?)',[thisElement], (err,row) => {
        if (err){console.error(err.message);}
        if (row){console.log(thisElement+' existiert bereits!');}
        else {
            db.run('INSERT INTO foodlist(foodname) VALUES(?)',[thisElement],(err)=>{
                if (err){console.error(err.message);}
                console.log('Element ('+thisElement+') wurde hinzugefügt');
            });
        }
    });
}

addElement('gebratene Nudeln');
addElement('Salamipizza');
addElement('Sushi-Döner');

app.get('/gebratene_nudeln/', (req, res) => {
        res.json('Gebratene Nudeln vom Chinesen sind einfach am besten mit Sweet Chilli Sauce. Hmmm... Lecker!');
    }
);

app.get('/salamipizza/', (req, res) => {
    res.json('Eine Salamipizza vom Italiener mit extra viel Käse darf bei meiner Lieblingsessensliste nicht fehlen.');
}
);

app.get('/sushi_doener/', (req, res) => {
    res.json('Eine Erfindung von der Gruppe 24_09_ON. Scheint eine Shushirolle mit Dönerfleisch, Sauce und Reis zu sein.');
}
);

app.get('/getdb',(req,res)=>{
    db.all('SELECT foodname FROM foodlist',(err,rows)=>{
        if (err){
            console.error(err.message);
            res.status(500).send('DataBaseError!')
            return;}
        if (rows && rows.length > 0){
            const foodNames = rows.map(row=>row.foodname);
            res.json(foodNames);
        } else {res.status(404).send('Not Found')}
    })
})

app.listen(PORT, () => {
    console.log('Server is running on port '+ PORT);
});
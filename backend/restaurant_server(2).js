const express = require('express');
const cors = require('cors');
const fetch = import('node-fetch');
const app = express();
const PORT = 4002;
app.use(cors());
app.use(express.json());

app.get('/', async (req,res) => {
    try {
        const response = await fetch('http://localhost:4001/getdb');
        if (!response.ok){
            throw new Error('HTTP Error!');
        }
        const jsonData = await response.json();
        res.json(jsonData);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        res.status(500).json('Server Error!')
      }
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
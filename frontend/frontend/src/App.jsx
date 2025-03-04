import React,{ useState, useEffect } from 'react'
import './App.css'

function CheckDatabase(){
  const [dbData, setDbData] = useState([]);

  async function getData(){
    try{
      const response = await fetch('http://localhost:5000/data');
      const jsonData = await response.json();
      setDbData(jsonData.data);
    } catch (error) {
    }
  }
  useEffect(()=> {
    getData();
  }, []);
  return (
    <ul>
      {dbData.map((obj, index) => (
        <li key={index}>{obj.tasks}</li>
      ))}
    </ul>
  )
}

function addTask(){
  let task = document.getElementById('userInput').value;
  if(task!="") {
    fetch('http://localhost:5000/add/'+task);
  }
  location.reload();
}

function App() {
  return (
    <div>
      <h1>To-Do Liste</h1>
      <input id="userInput" type="text" placeholder="Neue Aufgabe hinzufügen" />
      <button onClick="">Hinzufügen</button>
      <ul id="tasks"><checkDatabase/></ul>
    </div>
  )
}

export default App;
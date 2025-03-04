import React, { useState, useEffect } from 'react';
import './App.css';

function CheckDatabase({ dbData, setDbData }) {
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('http://localhost:5000/data');
        const jsonData = await response.json();
        setDbData(jsonData.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    }
    getData();
  }, [setDbData]);

  return (
    <ul>
      {dbData.map((obj, index) => (
        <li key={index}>
          {obj.tasks} <DoneTask obj={obj} index={index} setDbData={setDbData} />
        </li>
      ))}
    </ul>
  );
}

function DoneTask({ obj, index, setDbData }) {
  let doneTask = () => {
    fetch('http://localhost:5000/done/' + index)
      .then(() => {
        setDbData((prevData) => {
          const newData = [...prevData];
          newData[index].Done = !newData[index].Done;
          return newData;
        });
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
      });
  };
  return (
    <div
      id={index}
      className={obj.Done ? 'Done' : 'ToDo'}
      onClick={doneTask}
    ></div>
  );
}

function AddTask({ setDbData }) {
  let addTask = () => {
    let task = document.getElementById('userInput').value;
    if (task !== '') {
      fetch('http://localhost:5000/add/' + task, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: task, Done: false }),
      })
        .then((response) => response.json())
        .then((newTask) => {
          setDbData((prevData) => [...prevData, newTask]);
        })
        .catch((error) => {
          console.error('Fehler beim Hinzufügen der Aufgabe:', error);
        });
    }
  };
  return (
    <>
      <input id="userInput" type="text" placeholder="Neue Aufgabe hinzufügen" />
      <button onClick={addTask}>Add</button>
    </>
  );
}

function App() {
  const [dbData, setDbData] = useState([]);

  return (
    <div>
      <h1>To-Do Liste</h1>
      <h2>Thememode</h2>
      <ChangeMode />
      <AddTask setDbData={setDbData}/>
      <CheckDatabase dbData={dbData} setDbData={setDbData} />
    </div>
  );
}

function ChangeMode() {
  const [themeMode, setthemeMode] = useState('dark');
  let changeLight = () => {
    if (themeMode === 'dark') {
      setthemeMode('light');
      document.getElementsByTagName('body')[0].style.backgroundColor = 'azure';
      document.getElementById('userInput').style.borderColor = '#242424';
      document.getElementsByTagName('body')[0].style.color = '#242424';
    } else {
      setthemeMode('dark');
      document.getElementsByTagName('body')[0].style.backgroundColor = '#242424';
      document.getElementById('userInput').style.borderColor = 'azure';
      document.getElementsByTagName('body')[0].style.color = 'azure';
    }
  };
  return (
    <>
      <input type="checkbox" id="theme" className="toggle" onClick={changeLight} />
      <label htmlFor="theme" className="label">
        <div className="ball"></div>
      </label>
      <br />
      <br />
    </>
  );
}

export default App;
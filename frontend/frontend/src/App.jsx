import React, { useState, useEffect, useRef } from 'react';
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
        <li key={obj.id} id={obj.id}>
          {obj.tasks} <DoneTask obj={obj} index={index} setDbData={setDbData} />
        </li>
      ))}
    </ul>
  );
}

function DoneTask({ obj,index, setDbData }) {
  const doneTask = async () => {
    try{
      const response = await fetch('http://localhost:5000/done/' + obj.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({index: obj.id}),
      });
      if (!response.ok){
        throw new Error('HTTP Error! Status: '+response.status);
      }
      const data = await response.json();
      if (data.done !== undefined){
        setDbData((prevData) => {
          const newData = [...prevData];
          newData[index].Done = data.done;
          return newData;
        });
      };
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
      };
  };

  const DeleteThis = async () => {
    try {
      const response = await fetch(`http://localhost:5000/deletethis/${obj.id}`, {
        method: 'DELETE',
      });
      console.log(index);
      setDbData((prevData) => {
        console.log(prevData);
        const newData = prevData.filter((_,i) => i !== index);
        console.log(newData);
        return newData;
      }

      );
    } catch (error){
      console.error('Fehler beim Löschen der Aufgabe:', error);
    }
  }

  return (<>
    <div id={obj.id} className={obj.Done ? 'Done' : 'ToDo'} onClick={doneTask}></div>
    <button onClick={DeleteThis}>🗑️</button>
    </>
  );
}

function AddTask({ setDbData }) {
  const inputRef = useRef(null);
  let addTask = () => {
    let task = inputRef.current.value.trim();
    if (task !== '') {
      fetch('http://localhost:5000/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: task, Done: false }),
      })
        .then((response) => response.json())
        .then((newTask) => {
          setDbData((prevData) => [...prevData, newTask]);
          inputRef.current.value = '';
        })
        .catch((error) => {
          console.error('Fehler beim Hinzufügen der Aufgabe:', error);
        });
    }
  };
  return (
    <>
      <input ref={inputRef} id="userInput" type="text" placeholder="Add new Task..." />
      <button onClick={addTask}>Add</button>
    </>
  );
}

function DeleteDatabase({setDbData}){
  let deleteDb = async () => {
      fetch('http://localhost:5000/del/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          response.json();
          setDbData([]);
        })
        .catch((error) => {
          console.error('Fehler beim Löschen der Aufgaben:', error);
        });
    };
  return (
    <>
      <button onClick={deleteDb}>Delete All</button>
    </>
  )
}

function App() {
  const [dbData, setDbData] = useState([]);

  return (
    <div>
      <h1>Daily To-Do Liste</h1>
      <h2>Thememode</h2>
      <ChangeMode />
      <AddTask setDbData={setDbData}/>
      <CheckDatabase dbData={dbData} setDbData={setDbData} />
      <DeleteDatabase setDbData={setDbData}/><br />
      <FunButton />
    </div>
  );
}

function FunButton(){
  const [pos,setPos] = useState([20,20]);
  let FB = document.getElementById('FunButton');
  function rePosition(){
    let top = Math.round(Math.random() * (window.innerHeight - 50));
    let left =Math.round(Math.random() * (window.innerWidth - 150));
    setPos([top,left]);
    FB.addEventListener('focus', function(event) {event.target.blur();});
  }
  const Style = {
    top: pos[0] + 'px',
    left: pos[1] + 'px',
  }
  return (<button id="FunButton" onMouseOver={rePosition} onFocus={rePosition} style={Style}>Catch Me!</button>);
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
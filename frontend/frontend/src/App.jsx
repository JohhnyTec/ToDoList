import React,{ useState } from 'react'
import './App.css'

function App() {
  return (
    <div>
      <h1>To-Do Liste</h1>
      <input type="text" value= "" onChange= "" placeholder="Neue Aufgabe hinzufügen" />
      <button onClick="">Hinzufügen</button>
      <ul id="tasks">
        <li>Task 1</li>
        <li>Task 2</li>
      </ul>
    </div>
  )
}

export default App;
import React,{ useState, useEffect } from 'react'
import './App.css'

function App() {
  return (
    <div>
      <h1>To-Do Liste</h1>
      <input id="userInput" type="text" placeholder="Add new Task" />
      <button onClick={addTask}>Add Task</button>
      <CheckDatabase />
    </div>
  )
}

export default App;
import React,{ useState } from 'react'
import './App.css'

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

// function checkDatabase(){
//   if 
// }

export default App;
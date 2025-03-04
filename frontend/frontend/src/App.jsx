import React,{ useState, useEffect } from 'react'
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

function checkDatabase(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:5000/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
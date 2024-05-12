import { useEffect, useState } from 'react'
import Car from './Car.jsx'
import './App.css'

function App() {
  const [error, setError] = useState(null)
  const [cars, setCars] = useState([])

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}api/cars`)
        if (response.status === 200) {
          const cars = await response.json()
          setCars(cars)
        } else {
          const message = `${response.statusText} ${response.status}`
          setError(message)
          console.error(message)
        }
      } catch (e) {
        const message = `${response.statusText} ${response.status}`
        setError(message)
        console.error(message)
      }
    }
    fetchCars()
  }, [])

  return (
    <>
      <h1>{import.meta.env.VITE_APP_TITLE}</h1>
      {error
        ? <code>Something went wrong: {error}</code>
        : <ul>{cars.map(car => <Car key={car.id} {...car} />)}</ul>
      }
    </>
  )
}

export default App

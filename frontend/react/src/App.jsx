import { useEffect, useState } from 'react'
import Car from './Car.jsx'
import './App.css'

function App() {
  const [error, setError] = useState(null)
  const [cars, setCars] = useState([])

  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await fetch(`${import.meta.env.BASE_URL}api/cars`)
        if (data.status === 200) {
          const cars = await data.json()
          setCars(cars)
        } else {
          const text = await data.text()
          setError(text)
          console.error(text)
        }
      } catch (e) {
        setCars([])
        setError(e)
        console.error(e)
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

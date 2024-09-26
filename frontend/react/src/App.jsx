import { useEffect, useState } from 'react'
import Car from './Car.jsx'
import './App.css'

function App() {
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [cars, setCars] = useState([])

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}api/cars`)
        if (response.status === 200) {
          const result = await response.json()
          setMessage(result.message)
          setCars(result.cars)
        } else {
          const error = `${response.statusText} ${response.status}`
          setError(error)
          console.error(error)
        }
      } catch (e) {
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
        : <>
          <p>{message}</p>
          <ul>{cars.map(car => <Car key={car.id} {...car} />)}</ul>
        </>
      }
    </>
  )
}

export default App

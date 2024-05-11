import express from 'express'
import pgPromise from 'pg-promise'

const pgp = pgPromise()
const db = pgp(process.env.PG_URL)

const app = express()

app.get("/api/cars", async (req, res) => {
    try {
        res.json(await db.any('SELECT * FROM car'))
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`)
})
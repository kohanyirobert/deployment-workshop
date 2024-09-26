import os from 'node:os'
import express from 'express'
import pgPromise from 'pg-promise'

const pgp = pgPromise()
const db = pgp(process.env.PG_URL)

const app = express()

app.get("/api/cars", async (req, res) => {
    const msg = `hostname=${os.hostname()}, ip=${req.ip}, ips=${req.ips}, remote=${req.socket.remoteAddress}, x-forwarded-for=${req.headers['x-forwarded-for']}`
    console.log(msg)
    try {
        res.json({
            cars: await db.any('SELECT * FROM car'),
            message: msg,
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`)
})
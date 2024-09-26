import os from 'node:os'
import express from 'express'
import pgPromise from 'pg-promise'
import pgConnectionString from 'pg-connection-string';

const pgp = pgPromise()
const config = pgConnectionString.parse(process.env.PG_URL)
config.ssl = {
    rejectUnauthorized: false
}
const db = pgp(config)

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
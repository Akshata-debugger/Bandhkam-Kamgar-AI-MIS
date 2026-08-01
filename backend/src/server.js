import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { verifyDatabaseConnection } from './db.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', async (_request, response) => {
  try {
    await verifyDatabaseConnection()

    response.json({
      database: 'connected',
      message: 'Bandhkam Kamgar API is running',
      status: 'ok',
    })
  } catch (error) {
    response.status(503).json({
      database: 'unavailable',
      message: 'Bandhkam Kamgar API is running, but the database is unavailable',
      status: 'error',
    })
  }
})

app.listen(port, () => {
  console.log(`Bandhkam Kamgar API listening on http://localhost:${port}`)
})

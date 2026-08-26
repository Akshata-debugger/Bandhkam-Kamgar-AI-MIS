import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { verifyDatabaseConnection } from './db.js'
import authRoutes, { createDefaultAdminIfNeeded } from './routes/auth.js'
import jwt from 'jsonwebtoken'
import workerRoutes from './routes/workers.js'
import staffRoutes from './routes/staff.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not configured. Login tokens will not be available until it is set.')
}

app.locals.jwt = jwt

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/staff', staffRoutes)

app.get('/api/health', async (_request, response) => {
  try {
    await verifyDatabaseConnection()

    response.json({
      database: 'connected',
      message: 'Ratnagiri District General Workers Union API is running',
      status: 'ok',
    })
  } catch (error) {
    response.status(503).json({
      database: 'unavailable',
      message: 'Ratnagiri District General Workers Union API is running, but the database is unavailable',
      status: 'error',
    })
  }
})

async function startServer() {
  try {
    const adminCreated = await createDefaultAdminIfNeeded()

    if (adminCreated) {
      console.log('Default administrator account created.')
    }
  } catch (error) {
    console.warn(`Default administrator setup skipped: ${error.message}`)
  }

  app.listen(port, () => {
  console.log(`Ratnagiri District General Workers Union API listening on http://localhost:${port}`)
  })
}

startServer()

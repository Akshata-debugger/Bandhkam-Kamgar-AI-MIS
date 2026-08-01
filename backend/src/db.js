import mysql from 'mysql2/promise'

const requiredSettings = ['DB_HOST', 'DB_USER', 'DB_NAME']

let pool

export function getDatabasePool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}

export async function verifyDatabaseConnection() {
  const missingSetting = requiredSettings.find((setting) => !process.env[setting])

  if (missingSetting) {
    throw new Error(`Missing required database setting: ${missingSetting}`)
  }

  const connection = await getDatabasePool().getConnection()

  try {
    await connection.ping()
  } finally {
    connection.release()
  }
}

export default getDatabasePool

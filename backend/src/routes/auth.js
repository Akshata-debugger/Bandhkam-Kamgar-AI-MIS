import bcrypt from 'bcrypt'
import { Router } from 'express'
import getDatabasePool from '../db.js'

const router = Router()

const defaultAdmin = {
  email: 'admin@bandhkam.gov.in',
  fullName: 'System Administrator',
  password: 'Admin@123',
  username: 'admin',
}

export async function createDefaultAdminIfNeeded() {
  const pool = getDatabasePool()
  const [admins] = await pool.execute(
    "SELECT id FROM users WHERE role = 'admin' LIMIT 1",
  )

  if (admins.length > 0) {
    return false
  }

  const passwordHash = await bcrypt.hash(defaultAdmin.password, 12)

  await pool.execute(
    `INSERT INTO users (full_name, username, email, password_hash, role)
     VALUES (?, ?, ?, ?, 'admin')`,
    [
      defaultAdmin.fullName,
      defaultAdmin.username,
      defaultAdmin.email,
      passwordHash,
    ],
  )

  return true
}

router.post('/login', async (request, response) => {
  const { email, identifier, password, username } = request.body
  const loginIdentifier = String(identifier || username || email || '').trim()

  if (!loginIdentifier || typeof password !== 'string' || !password) {
    return response.status(400).json({
      message: 'Username or email and password are required.',
    })
  }

  try {
    const pool = getDatabasePool()
    const [users] = await pool.execute(
      `SELECT id, full_name, username, email, password_hash, role, is_active
       FROM users
       WHERE username = ? OR email = ?
       LIMIT 1`,
      [loginIdentifier, loginIdentifier.toLowerCase()],
    )
    const user = users[0]

    if (!user || !user.is_active) {
      return response.status(401).json({ message: 'Invalid username/email or password.' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
      return response.status(401).json({ message: 'Invalid username/email or password.' })
    }

    const token = request.app.locals.jwt.sign(
      { role: user.role, username: user.username },
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h', subject: String(user.id) },
    )

    return response.json({
      message: 'Login successful.',
      token,
      user: {
        email: user.email,
        fullName: user.full_name,
        id: user.id,
        role: user.role,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Login failed:', error.message)
    return response.status(500).json({ message: 'Unable to complete login.' })
  }
})

export default router

import bcrypt from 'bcrypt'
import { Router } from 'express'
import getDatabasePool from '../db.js'
import { authenticate } from '../middleware/authMiddleware.js'

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
  const { email, identifier, password, username, rememberMe } = request.body
  const loginIdentifier = String(identifier || username || email || '').trim()

  if (!loginIdentifier || typeof password !== 'string' || !password) {
    return response.status(400).json({
      message: 'Username or email and password are required.',
    })
  }

  try {
    const pool = getDatabasePool()
    const [users] = await pool.execute(
      `SELECT id, full_name, username, email, mobile_number, password_hash, role, is_active, last_login_at
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

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured.')
    }

    const token = request.app.locals.jwt.sign(
      { role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '8h'), subject: String(user.id) },
    )
    await pool.execute('UPDATE users SET last_login_at=CURRENT_TIMESTAMP WHERE id=?',[user.id])

    return response.json({
      message: 'Login successful.',
      token,
      user: {
        email: user.email,
        fullName: user.full_name,
        id: user.id,
        isActive: Boolean(user.is_active),
        lastLoginAt: new Date().toISOString(),
        mobileNumber: user.mobile_number,
        role: user.role,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Login failed:', error.message)
    return response.status(500).json({ message: 'Unable to complete login.' })
  }
})

router.post('/change-password', authenticate, async (request, response) => {
  const { currentPassword, newPassword, confirmPassword } = request.body
  if (!currentPassword || !newPassword || newPassword !== confirmPassword) return response.status(400).json({ message: 'Please provide matching passwords.' })
  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) return response.status(400).json({ message: 'Use at least 8 characters with uppercase, lowercase, and a number.' })
  try {
    const pool = getDatabasePool(); const [rows] = await pool.execute('SELECT password_hash FROM users WHERE id=?',[request.user.sub])
    if (!rows[0] || !await bcrypt.compare(currentPassword,rows[0].password_hash)) return response.status(401).json({ message: 'Current password is incorrect.' })
    await pool.execute('UPDATE users SET password_hash=? WHERE id=?',[await bcrypt.hash(newPassword,12),request.user.sub])
    response.status(204).end()
  } catch (error) { response.status(500).json({ message: 'Unable to change password.' }) }
})

export default router

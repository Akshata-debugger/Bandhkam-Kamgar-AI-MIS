import dotenv from 'dotenv'
import getDatabasePool from './db.js'

dotenv.config()

const pool = getDatabasePool()
const connection = await pool.getConnection()
const testSuffix = Date.now().toString().slice(-8)

try {
  await connection.beginTransaction()

  const [talukaResult] = await connection.execute(
    'INSERT INTO talukas (name) VALUES (?)',
    [`Database Test Taluka ${testSuffix}`],
  )
  const talukaId = talukaResult.insertId

  const [villageResult] = await connection.execute(
    'INSERT INTO villages (taluka_id, name) VALUES (?, ?)',
    [talukaId, `Database Test Village ${testSuffix}`],
  )
  const [tfcResult] = await connection.execute(
    'INSERT INTO tfc_centers (taluka_id, name) VALUES (?, ?)',
    [talukaId, `Database Test TFC ${testSuffix}`],
  )
  const [categoryResult] = await connection.execute(
    'INSERT INTO categories (name) VALUES (?)',
    [`Database Test Category ${testSuffix}`],
  )
  const [benefitResult] = await connection.execute(
    'INSERT INTO benefit_types (name) VALUES (?)',
    [`Database Test Benefit ${testSuffix}`],
  )

  const [applicationResult] = await connection.execute(
    `INSERT INTO applications (
      source_sr_no, applicant_name, mobile_number, aadhaar_number, category_id,
      village_id, taluka_id, form_type, tfc_center_id, benefit_type_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1,
      'Database Test Applicant',
      '9999999999',
      `9${testSuffix.padStart(11, '0')}`.slice(0, 12),
      categoryResult.insertId,
      villageResult.insertId,
      talukaId,
      'new_registration',
      tfcResult.insertId,
      benefitResult.insertId,
      'pending',
    ],
  )

  const [rows] = await connection.execute(
    `SELECT a.applicant_name, a.status, v.name AS village_name, t.name AS taluka_name
     FROM applications a
     JOIN villages v ON v.id = a.village_id
     JOIN talukas t ON t.id = a.taluka_id
     WHERE a.id = ?`,
    [applicationResult.insertId],
  )

  if (rows.length !== 1 || rows[0].applicant_name !== 'Database Test Applicant') {
    throw new Error('Inserted application could not be retrieved.')
  }

  await connection.rollback()
  console.log('Database write/read test passed. No test data was saved.')
} catch (error) {
  await connection.rollback()
  console.error('Database write/read test failed:', error.message)
  process.exitCode = 1
} finally {
  connection.release()
  await pool.end()
}

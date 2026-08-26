import getDatabasePool from '../db.js'

const eventTitles = { registration: 'Registration', card_issued: 'Card issued', physical_verification: 'Physical verification', renewal: 'Card renewal', scholarship: 'Scholarship', claim: 'Claim', import: 'Imported record' }
const date = (value) => value || new Date().toISOString().slice(0, 10)

async function addEvent(pool, workerId, eventType, eventDate, details, userId, sourceTable, sourceId) {
  await pool.execute('INSERT INTO worker_lifecycle_events(worker_id,event_type,event_date,title,details,source_table,source_id,created_by) VALUES(?,?,?,?,?,?,?,?)', [workerId, eventType, date(eventDate), eventTitles[eventType], details || null, sourceTable, sourceId, userId])
}

export async function getLifecycle(workerId) {
  const pool = getDatabasePool()
  const [worker] = await pool.execute('SELECT id,worker_code,registration_date,worker_card_number,card_issue_date,card_expiry_date,physical_verification_date,current_status FROM workers WHERE id=?', [workerId])
  if (!worker[0]) return null
  const [cards, verifications, scholarships, claims, renewals, events] = await Promise.all([
    pool.execute('SELECT * FROM worker_card_history WHERE worker_id=? ORDER BY created_at DESC', [workerId]),
    pool.execute('SELECT pv.*,u.full_name verified_by_name FROM physical_verification_history pv LEFT JOIN users u ON u.id=pv.verified_by WHERE worker_id=? ORDER BY created_at DESC', [workerId]),
    pool.execute('SELECT s.*,sc.name scheme_name FROM scholarships s LEFT JOIN schemes sc ON sc.id=s.scheme_id WHERE s.worker_id=? ORDER BY s.created_at DESC', [workerId]),
    pool.execute('SELECT * FROM worker_claims WHERE worker_id=? ORDER BY created_at DESC', [workerId]),
    pool.execute('SELECT * FROM card_renewals WHERE worker_id=? ORDER BY created_at DESC', [workerId]),
    pool.execute('SELECT * FROM worker_lifecycle_events WHERE worker_id=? ORDER BY event_date DESC,id DESC', [workerId]),
  ])
  const generated = [{ event_type: 'registration', event_date: worker[0].registration_date, title: 'Registration', details: 'Worker registration completed.' }]
  if (worker[0].card_issue_date) generated.push({ event_type: 'card_issued', event_date: worker[0].card_issue_date, title: 'Card issued', details: worker[0].worker_card_number || null })
  if (worker[0].physical_verification_date) generated.push({ event_type: 'physical_verification', event_date: worker[0].physical_verification_date, title: 'Physical verification', details: null })
  return { worker: worker[0], cards: cards[0], verifications: verifications[0], scholarships: scholarships[0], claims: claims[0], renewals: renewals[0], timeline: [...events[0], ...generated].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)) }
}

export async function createLifecycleRecord(workerId, type, input, userId) {
  const pool = getDatabasePool(); let result; let eventDate; let details; let sourceTable
  if (type === 'card') { const [r] = await pool.execute('INSERT INTO worker_card_history(worker_id,card_number,issue_date,expiry_date,renewal_due_date,card_status,remarks,created_by) VALUES(?,?,?,?,?,?,?,?)', [workerId,input.card_number||null,input.issue_date||null,input.expiry_date||null,input.renewal_due_date||null,input.card_status||'active',input.remarks||null,userId]); result=r; eventDate=input.issue_date; details=input.card_number; sourceTable='worker_card_history' }
  else if (type === 'verification') { const [r] = await pool.execute('INSERT INTO physical_verification_history(worker_id,verification_date,verification_status,verified_by,verification_remarks) VALUES(?,?,?,?,?)', [workerId,input.verification_date||null,input.verification_status||'pending',input.verified_by||userId,input.verification_remarks||null]); result=r; eventDate=input.verification_date; details=input.verification_status; sourceTable='physical_verification_history' }
  else if (type === 'scholarship') { const [r] = await pool.execute('INSERT INTO scholarships(worker_id,student_name,academic_year,amount,status,remarks) VALUES(?,?,?,?,?,?)', [workerId,input.student_name||null,input.academic_year||null,input.amount||null,input.status||'pending',input.remarks||null]); result=r; eventDate=input.date; details=input.scholarship_type||'Scholarship'; sourceTable='scholarships' }
  else if (type === 'claim') { const [r] = await pool.execute('INSERT INTO worker_claims(worker_id,claim_type,application_date,status,approval_date,amount,remarks,created_by) VALUES(?,?,?,?,?,?,?,?)', [workerId,input.claim_type,input.application_date,input.status||'pending',input.approval_date||null,input.amount||null,input.remarks||null,userId]); result=r; eventDate=input.application_date; details=input.claim_type; sourceTable='worker_claims' }
  else throw new Error('Unsupported lifecycle record type.')
  await addEvent(pool, workerId, type === 'card' ? 'card_issued' : type === 'verification' ? 'physical_verification' : type, eventDate, details, userId, sourceTable, result.insertId)
  return getLifecycle(workerId)
}

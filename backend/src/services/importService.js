import getDatabasePool from '../db.js'

export const supportedImportSources = ['google_sheets', 'csv', 'excel']
const normalise = (value) => String(value || '').replace(/\D/g, '')
export function validateImportRow(row) {
  const errors=[]; if (!row.first_name || !row.last_name) errors.push('First and last name are required.'); if (!/^\d{10,15}$/.test(normalise(row.mobile_number))) errors.push('Mobile number is invalid.'); if (!/^\d{12}$/.test(normalise(row.aadhaar_number))) errors.push('Aadhaar number must contain 12 digits.'); if (!row.registration_date || Number.isNaN(new Date(row.registration_date).getTime())) errors.push('Registration date is invalid.'); return errors
}
export async function previewImport({ sourceType, sourceName, rows }, userId) {
  if (!supportedImportSources.includes(sourceType)) throw new Error('Unsupported import source.')
  if (!Array.isArray(rows)) throw new Error('Rows must be an array.')
  const pool=getDatabasePool(); const [history]=await pool.execute('INSERT INTO import_history(source_type,source_name,imported_by,rows_read,status) VALUES(?,?,?,?,\'previewed\')',[sourceType,sourceName||'Untitled import',userId,rows.length]); const summary={rowsRead:rows.length,workersAdded:0,workersUpdated:0,duplicates:0,errors:0,noChange:0}; const decisions=[]
  for (let index=0; index<rows.length; index+=1) { const row=rows[index]; const errors=validateImportRow(row); let action='new_worker'; let workerId=null; let message='Ready to create.'; if (errors.length) { action='error'; message=errors.join(' '); summary.errors+=1 } else { const [matches]=await pool.execute('SELECT id,worker_code,aadhaar_number,mobile_number,worker_card_number,registration_date FROM workers WHERE aadhaar_number=? OR mobile_number=? OR (worker_card_number IS NOT NULL AND worker_card_number=?) LIMIT 2',[normalise(row.aadhaar_number),normalise(row.mobile_number),row.worker_card_number||null]); if (matches.length>1) { action='duplicate'; message='Multiple matching workers found.'; summary.duplicates+=1 } else if (matches[0]) { workerId=matches[0].id; const same=['aadhaar_number','mobile_number','worker_card_number','registration_date'].every((key)=>String(matches[0][key]||'')===String(row[key]||'')); action=same?'no_change':'update_worker'; message=same?'Matching worker has no changed key fields.':`Matches ${matches[0].worker_code}; review as update.`; summary[same?'noChange':'workersUpdated']+=1 } else summary.workersAdded+=1 }
    decisions.push({ rowNumber:index+1, action, message, workerId }); await pool.execute('INSERT INTO import_sync_logs(import_history_id,source_row_number,worker_id,decision,message,payload) VALUES(?,?,?,?,?,?)',[history.insertId,index+1,workerId,action,message,JSON.stringify(row)])
  }
  await pool.execute('UPDATE import_history SET workers_added=?,workers_updated=?,duplicates=?,errors=?,completed_at=CURRENT_TIMESTAMP WHERE id=?',[summary.workersAdded,summary.workersUpdated,summary.duplicates,summary.errors,history.insertId]); return { importId:history.insertId,summary,decisions }
}

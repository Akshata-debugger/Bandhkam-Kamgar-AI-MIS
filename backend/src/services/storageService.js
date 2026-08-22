import path from 'node:path'
import { mkdir } from 'node:fs/promises'

export const documentFolders = {
  photo: 'photos', aadhaar: 'aadhaar', worker_card: 'worker-cards', bank_passbook: 'bank-passbooks',
  scholarship: 'scholarship-documents', claim: 'claim-documents', income_certificate: 'income-certificates',
  residence_certificate: 'residence-certificates', other: 'other',
}
export const uploadsRoot = path.resolve('uploads/workers')
export async function prepareUploadFolders() { await Promise.all(Object.values(documentFolders).map((folder) => mkdir(path.join(uploadsRoot, folder), { recursive: true }))) }
export function publicUploadPath(filePath) { return `/uploads/${path.relative(path.resolve('uploads'), filePath).replaceAll('\\', '/')}` }

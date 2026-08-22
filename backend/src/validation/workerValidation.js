const required = ['first_name', 'last_name', 'mobile_number', 'aadhaar_number', 'registration_date']
export function validateWorker(input) {
  const missing = required.filter((field) => !String(input[field] || '').trim())
  if (missing.length) return `Required fields: ${missing.join(', ')}`
  if (!/^\d{12}$/.test(String(input.aadhaar_number))) return 'Aadhaar number must contain 12 digits.'
  if (!/^\d{10,15}$/.test(String(input.mobile_number).replace(/\D/g, ''))) return 'Enter a valid mobile number.'
  return null
}

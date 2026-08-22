const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  constructor(message, status, details) { super(message); this.status = status; this.details = details }
}

export async function api(path, { method = 'GET', body, token, headers = {} } = {}) {
  const isForm = body instanceof FormData
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })
  const payload = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : null
  if (response.status === 401) window.dispatchEvent(new Event('auth:expired'))
  if (!response.ok) throw new ApiError(payload?.message || 'Unable to complete the request.', response.status, payload)
  return payload
}

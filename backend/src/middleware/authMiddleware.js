import jwt from 'jsonwebtoken'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.')
  }

  return secret
}

export function authenticate(request, response, next) {
  const authorization = request.headers.authorization || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentication token is required.' })
  }

  try {
    request.user = jwt.verify(token, getJwtSecret())
    return next()
  } catch (_error) {
    return response.status(401).json({ message: 'Invalid or expired authentication token.' })
  }
}

export function authorizeRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ message: 'You do not have permission for this action.' })
    }

    return next()
  }
}

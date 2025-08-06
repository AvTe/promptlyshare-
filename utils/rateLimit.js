/**
 * Simple in-memory rate limiting utility
 * For production, consider using Redis or a dedicated rate limiting service
 */

const rateLimitMap = new Map();

export function rateLimit(identifier, limit = 10, window = 60000) {
  const now = Date.now();
  const windowStart = now - window;

  // Clean up old entries
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.timestamp < windowStart) {
        rateLimitMap.delete(key);
      }
    }
  }

  const current = rateLimitMap.get(identifier) || { count: 0, timestamp: now };

  // Reset count if window has passed
  if (current.timestamp < windowStart) {
    current.count = 0;
    current.timestamp = now;
  }

  current.count++;
  rateLimitMap.set(identifier, current);

  return {
    success: current.count <= limit,
    limit,
    remaining: Math.max(0, limit - current.count),
    resetTime: new Date(current.timestamp + window)
  };
}

/**
 * Get client IP address from request
 * @param {Request} request - The incoming request
 * @returns {string} - Client IP address
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Apply rate limiting to API endpoints
 * @param {Request} request - The incoming request
 * @param {Object} options - Rate limiting options
 * @returns {Object} - Rate limit result
 */
export function applyRateLimit(request, options = {}) {
  const { limit = 10, window = 60000 } = options;
  const clientIP = getClientIP(request);
  const identifier = `${clientIP}:${request.url}`;
  
  return rateLimit(identifier, limit, window);
}
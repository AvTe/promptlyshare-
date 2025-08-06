import { getServerSession } from 'next-auth/next';
import { authOptions } from '@app/api/auth/[...nextauth]/route';

/**
 * Middleware to check if user is authenticated
 * @param {Request} request - The incoming request
 * @returns {Object|null} - User session or null if not authenticated
 */
export async function getAuthenticatedUser(request) {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Middleware to validate if user owns the resource
 * @param {string} userId - User ID from session
 * @param {string} resourceOwnerId - Owner ID of the resource
 * @returns {boolean} - True if user owns the resource
 */
export function validateOwnership(userId, resourceOwnerId) {
  return userId && resourceOwnerId && userId === resourceOwnerId.toString();
}

/**
 * Security headers for API responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
};

/**
 * Create a secure response with security headers
 * @param {any} data - Response data
 * @param {number} status - HTTP status code
 * @param {Object} additionalHeaders - Additional headers
 * @returns {Response} - Secure response object
 */
export function createSecureResponse(data, status = 200, additionalHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...securityHeaders,
    ...additionalHeaders,
  };

  return new Response(
    typeof data === 'string' ? data : JSON.stringify(data),
    { status, headers }
  );
}
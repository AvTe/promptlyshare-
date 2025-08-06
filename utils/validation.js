/**
 * Input validation utilities for API endpoints
 */

/**
 * Validate and sanitize prompt input
 * @param {string} prompt - The prompt text
 * @returns {Object} - { isValid: boolean, sanitized: string, errors: string[] }
 */
export function validatePrompt(prompt) {
  const errors = [];
  
  if (!prompt || typeof prompt !== 'string') {
    errors.push('Prompt is required and must be a string');
  } else {
    const trimmed = prompt.trim();
    if (trimmed.length === 0) {
      errors.push('Prompt cannot be empty');
    } else if (trimmed.length < 10) {
      errors.push('Prompt must be at least 10 characters long');
    } else if (trimmed.length > 2000) {
      errors.push('Prompt must be less than 2000 characters');
    }
    
    // Sanitize by removing potential script tags and harmful content
    const sanitized = trimmed
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }
  
  return {
    isValid: false,
    sanitized: '',
    errors
  };
}

/**
 * Validate and sanitize tag input
 * @param {string} tag - The tag text
 * @returns {Object} - { isValid: boolean, sanitized: string, errors: string[] }
 */
export function validateTag(tag) {
  const errors = [];
  
  if (!tag || typeof tag !== 'string') {
    errors.push('Tag is required and must be a string');
  } else {
    const trimmed = tag.trim();
    if (trimmed.length === 0) {
      errors.push('Tag cannot be empty');
    } else if (trimmed.length > 50) {
      errors.push('Tag must be less than 50 characters');
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
      errors.push('Tag can only contain letters, numbers, spaces, hyphens, and underscores');
    }
    
    // Sanitize tag
    const sanitized = trimmed.toLowerCase().replace(/\s+/g, ' ');
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }
  
  return {
    isValid: false,
    sanitized: '',
    errors
  };
}

/**
 * Validate MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateObjectId(id) {
  const errors = [];
  
  if (!id || typeof id !== 'string') {
    errors.push('ID is required and must be a string');
  } else if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    errors.push('Invalid ID format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generic error response creator
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Response} - Error response
 */
export function createErrorResponse(message, status = 400) {
  return new Response(
    JSON.stringify({ 
      error: message,
      timestamp: new Date().toISOString()
    }), 
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  );
}
// Email validation using regex
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Input sanitization - prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Escape HTML entities
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  sanitized = sanitized.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
  
  return sanitized;
};

// Validate number input (for quantity, price, etc.)
export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (num < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }
  
  if (num > max) {
    return { isValid: false, error: `Value must not exceed ${max}` };
  }
  
  return { isValid: true, value: num };
};

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

// Validate name (letters, spaces, hyphens only)
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s-]+$/;
  
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, and hyphens' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Name must not exceed 50 characters' };
  }
  
  return { isValid: true };
};

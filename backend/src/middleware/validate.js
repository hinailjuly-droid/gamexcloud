const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remove any MongoDB operators
        sanitized[key] = value.replace(/[${}]/g, '');
        // Escape HTML
        sanitized[key] = validator.escape(sanitized[key]);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 24, 100);
  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
};

module.exports = { sanitizeInput, validateEmail, validatePagination };

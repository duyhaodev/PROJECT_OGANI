const csrf = require('csurf');

// Simple CSRF protection for testing
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  }
});

// Generate CSRF token
const csrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : 'TEST_TOKEN';
  next();
};

// Apply CSRF to non-GET routes
const csrfMiddleware = [
  (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return csrfProtection(req, res, next);
    }
    next();
  },
  csrfToken
];

module.exports = {
  csrfProtection,
  csrfToken,
  csrfMiddleware
};
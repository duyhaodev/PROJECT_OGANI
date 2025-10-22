const csrf = require('csurf');

const csrfProtection = csrf({
  cookie: {
    httpOnly: false,
    secure: true, // Set to true in production with HTTPS
  }
});

const csrfToken = (req, res, next) => {
  try {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.setHeader('X-CSRF-Token', res.locals.csrfToken);
    }
    
    next();
  } catch (err) {
    console.error('CSRF Token Error:', err);
    next(err);
  }
};

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
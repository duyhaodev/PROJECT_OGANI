const csrf = require('csurf');

let csrfProtection = (req, res, next) => next(); // mặc định không làm gì

if (process.env.NODE_ENV === 'production') {
  csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    },
    value: (req) => req.headers['x-csrf-token'] || req.body._csrf
  });
}

const csrfToken = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.locals.csrfToken = 'DEV_CSRF_DISABLED';
  } else if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  } else {
    res.locals.csrfToken = '';
  }
  next();
};

module.exports = {
  csrfProtection,
  csrfToken
};

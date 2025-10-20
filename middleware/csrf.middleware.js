const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });
const csrfToken = (req, res, next) => {
  if (true) {
    res.locals.csrfToken = 'DEV_CSRF_DISABLED';
  } else if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  } else {
    res.locals.csrfToken = '';
  }
  next();
};
module.exports = {csrfProtection, csrfToken}; 

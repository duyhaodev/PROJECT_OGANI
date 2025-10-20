const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });
const injectCsrf = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
module.exports = {csrfProtection, injectCsrf}; 
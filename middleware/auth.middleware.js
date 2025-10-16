module.exports.isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    console.warn('Unauthorized access attempt:', req.originalUrl);
    return res.redirect('/login');
  }
  next();
};
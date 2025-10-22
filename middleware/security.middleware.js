// Server Leaks Information via "X-Powered-By"
// Server Leaks Version Information via "Server"
function useSecurity(app) {
  // Xóa header X-Powered-By (ẩn thông tin framework Express)
  app.disable('x-powered-by');

  // Xóa header Server (ẩn thông tin máy chủ)
  app.use((req, res, next) => {
    res.removeHeader('Server');
    res.removeHeader('X-Powered-By'); // dự phòng
    next();
  });
}

module.exports = { useSecurity };

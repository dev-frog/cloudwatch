// notFound
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // eslint-disable-next-line no-undef
    stack: process.env.NODE_ENV === 'production' ? '🐿️' : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};

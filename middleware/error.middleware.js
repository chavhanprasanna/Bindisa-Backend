const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(errorResponse.error.status).json(errorResponse);
};

module.exports = errorHandler;
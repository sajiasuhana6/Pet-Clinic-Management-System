// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(`[ErrorHandler] ${req.method} ${req.path} →`, err.message);

  // determine status code from error message
  const message = err.message || "Internal Server Error";

  let statusCode = 500;

  if (message.includes("not found")) statusCode = 404;
  if (message.includes("already exists")) statusCode = 409;
  if (message.includes("Missing required fields")) statusCode = 400;
  if (message.includes("Invalid")) statusCode = 400;
  if (message.includes("Cannot build")) statusCode = 400;

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorHandler;

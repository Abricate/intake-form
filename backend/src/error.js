export function forbidden(message = 'Forbidden') {
  const error = new Error(message);
  error.status = 403;
  return error;
}

export function notFound(message = 'Not found') {
  const error = new Error(message);
  err.status = 404;
  return error;
}

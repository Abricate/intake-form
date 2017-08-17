export function forbidden(message = 'Forbidden') {
  const error = new Error(message);
  error.status = 403;
  return error;
}

export function notFound(message = 'Not found') {
  const error = new Error(message);
  error.status = 404;
  return error;
}

export function badRequest(message = 'Bad request') {
  const error = new Error(message);
  error.status = 400;
  return error;
}

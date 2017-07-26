import { forbidden } from '../../error';

export function mustBeAdmin(req, res, next) {
  if(!req.user) {
    next(forbidden("Must be logged in"));
  } else {
    if(!req.user.isAdmin) {
      next(forbidden("Must be admin"))
    } else {
      next()
    }
  }
}

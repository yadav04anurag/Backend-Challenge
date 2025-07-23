const { AppError } = require('../utils/appError');

const roles = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    next(new AppError('You do not have permission to perform this action', 403));
  };
};

module.exports = { roles };
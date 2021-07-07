const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');

module.exports.authenticateToken = function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
      next(ApiError.unauthorized());
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        next(ApiError.unauthorized())
        return;
      }
      req.user = user
      next()
    })
}
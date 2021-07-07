const ApiError = require('../../errors/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_decode =require("jwt-decode");
const knex = require('../../config/knex');

class UserController {
    async login(req, res, next) {
        try {
          if (!req.body || req.body.length == 0) {
            next(ApiError.badRequest('No user information was submitted'));
            return;
          }

          let { email, password } = req.body
          
          if ( !email || !password ) {
            next(ApiError.missingField());
            return;
          }

          email = email.toLowerCase().trim(); //checks email is lower case an spaces trimmed.

          let checked_user = await knex('users')
          .where({email})
          .limit(1);
  
          if (checked_user.length > 0) {
              const valid_password = await bcrypt.compare(password, checked_user[0].password);
              if(!valid_password) {
                next(ApiError.badRequest('Incorrect password'));
                return
              }
              const user = checked_user[0];
              delete user.password;
              const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
              return  res.status(200).json({accessToken: token, user: user});
         } else {
          next(ApiError.badRequest('Invalid log in attempt'));
          return;
         }
        } catch (error) {
          next(ApiError.badRequest(error));
          return;
        }
    }
    async checkToken(req, res, next) {
      try {
      if (!req.body || req.body.length == 0) {
        next(ApiError.badRequest('No user information was submitted'));
        return;
      }
      let { user, access_token } = req.body
      let checked_user = await knex('users')
          .where({email: user.email})
          .limit(1);
      let decoded = jwt_decode(access_token);
      if (checked_user[0].id == decoded.id &&
          checked_user[0].email == decoded.email
      ) res.status(200).send('Success');
      } catch (error) {
        next(ApiError.badRequest(error));
        return;
      }
    }
}


module.exports = new UserController();

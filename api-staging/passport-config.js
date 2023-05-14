const LocalStrategy = require('passport-local').Strategy;

const {
  ObjectId
} = require("mongodb");

const {
  timingSafeEqual
} = require("crypto");

const {
  FORBIDDEN,
  PASSSWORD_ERROR
} = require("./consts");

const {
  findOne,
  findById,
  getEncryptedPassword
} = require("./controllers/common/tenantController");

const initialize = (passport) => {
  const comparePassword = async (password, salt, userPassword) => {
    return getEncryptedPassword(password, salt)
      .then(({encryptedPassword}) =>
        timingSafeEqual(Buffer.from(encryptedPassword), Buffer.from(userPassword)))
      .catch(err => false);
  }

  const verify = (email, password, cb) => {
    const resolve = (user) => {
      if(!user) return cb(new Error(FORBIDDEN))

      comparePassword(password, user.salt, user.password)
      .then(res => {
        if (!res) return cb(new Error(PASSSWORD_ERROR));
        cb(null, user);
      });
    }

    findOne('User', {email}, '+salt').then(resolve);
  }

  const serializeUser = (user, cb) => cb(null, user._id.toString());
  const deserializeUser = (id, cb) => {
    findById('User', new ObjectId(id))
    .then(user => cb(null, user))
    .catch(err => cb(err));
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, verify))
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
}

module.exports = initialize;

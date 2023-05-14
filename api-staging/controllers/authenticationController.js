const passport = require("passport");

const {
  DEFAULT,
  PARAMS_ERROR,
  EMAIL_EXISTS,
  UNAUTHORIZED,
} = require("../consts");

const {
  create,
  findById,
  getEncryptedPassword,
} = require("./common/tenantController.js");

exports.findById = (req, res) => {
  findById('User', req.user._id, '-password -salt')
  .then(user => res.status(200).send({user}) )
  .catch(res.status(500).send({ message: DEFAULT }));
}

exports.authenticate = (role = false) => (req, res, next) => {
  try {
    req.isAuthenticated() && (!role || role == req.user.role)
    ? next() : res.status(401).send({ message: UNAUTHORIZED });
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.login = (req, res) => {
  try {
    passport.authenticate('local', {session: true}, (err, user) => {
      if(err) return res.status(403).send(err);

      req.logIn(user, (err) => {
        if(err) return res.error(err);
        else req.session.save(() => res.send(user));
      })
    })(req, res);
  } catch (error) {
    return res.status(500).send(error);
  }
}

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if(err)
      return res.status(500);
  })
  res.status(200).send({});
}

const SignUp = async (req, res, role="USER") => {
  payload = req.body;
  await getEncryptedPassword(payload.password)
    .then(({salt, encryptedPassword}) =>
      create('User', { ...payload, password: encryptedPassword, salt, role })
  ).then(({ _id, name, email, role }) => res.status(200).send({ _id, name, email, role }))
  .catch(err => {
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(500).send({ message: EMAIL_EXISTS });
    } else {
      return res.status(500).send(error);
      }
  });
}

exports.registerUser = (req, res) => SignUp(req, res);
exports.registerManager = (req, res) => SignUp(req, res, "MANAGER");

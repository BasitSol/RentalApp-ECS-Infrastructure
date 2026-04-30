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
  findOne,
  getEncryptedPassword,
} = require("./common/tenantController.js");

exports.findById = (req, res) => {
  findById('User', req.user._id, '-password -salt')
  .then(user => res.status(200).send({user}) )
  .catch(() => res.status(500).send({ message: DEFAULT }));
}

exports.authenticate = (role = false) => (req, res, next) => {
  try {
    req.isAuthenticated() && (!role || role == req.user.role)
    ? next() : res.status(401).send({ message: UNAUTHORIZED });
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.login = (req, res, next) => {
  try {
    // 1. Map the email to username so Passport.js can find it!
    if (req.body.email && !req.body.username) {
      req.body.username = req.body.email;
    }

    // 2. Add 'info' to the callback signature to catch the actual error message
    passport.authenticate('local', {session: true}, (err, user, info) => {
      
      // If there's a severe server/DB error
      if (err) return res.status(500).send(err);

      // If authentication fails (wrong password, user not found, etc.)
      if (!user) {
        // This will now send a real JSON message to your frontend instead of {}
        return res.status(403).send(info || { message: "Invalid email or password" });
      }

      // If authentication succeeds, log the user in
      req.logIn(user, (loginErr) => {
        // Fixed the res.error typo here!
        if (loginErr) return res.status(500).send(loginErr);
        
        req.session.save(() => res.status(200).send(user));
      });

    })(req, res, next);
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
  try {
    console.log("STEP 1: Signup route hit. Data received:", req.body);
    const payload = req.body;
    payload.username = payload.email;

    console.log("STEP 2: Encrypting password...");
    const { salt, encryptedPassword } = await getEncryptedPassword(payload.password);
    
    console.log("STEP 3: Saving user to database...");
    const newUser = await create('User', { ...payload, password: encryptedPassword, salt, role });

    console.log("STEP 4: Logging the new user in automatically...");
    // THIS IS THE MISSING MAGIC: Automatically establish the session
    req.logIn(newUser, (err) => {
      if (err) {
        console.error("Login after signup failed:", err);
        return res.status(500).send({ message: DEFAULT });
      }
      
      // Save the session and send the success response
      req.session.save(() => {
        console.log("STEP 5: Success! Session created and user sent to frontend.");
        return res.status(200).send({ 
          _id: newUser._id, 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        });
      });
    });

  } catch (err) {
    console.log("!!! FATAL SIGNUP ERROR !!!");
    console.log(err); 
    
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(500).send({ message: EMAIL_EXISTS });
    }
    return res.status(500).send(err);
  }
}

exports.registerUser = (req, res) => SignUp(req, res);
exports.registerManager = (req, res) => SignUp(req, res, "MANAGER");

exports.bootstrapManager = async (req, res) => {
  try {
    const manager = await findOne("User", { role: "MANAGER" });
    if (manager) {
      return res.status(409).send({ message: "Manager already exists" });
    }
    return SignUp(req, res, "MANAGER");
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
};

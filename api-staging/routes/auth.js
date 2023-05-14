const express = require("express");
const authRouter = express.Router();

const {
  login,
  logout,
  findById,
  authenticate,
  registerManager,
  registerUser
 } = require("../controllers/authenticationController.js");

authRouter.post("/login", login);
authRouter.post("/signup", registerUser);
authRouter.get("/me", authenticate(), findById);
authRouter.post("/logout", authenticate(), logout);
authRouter.post("/registerManger", authenticate("MANAGER"), registerManager);


module.exports = authRouter;

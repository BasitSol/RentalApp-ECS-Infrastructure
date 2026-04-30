const express = require("express");
const authRouter = express.Router();

const {
  login,
  logout,
  findById,
  authenticate,
  registerManager,
  registerUser,
  bootstrapManager,
 } = require("../controllers/authenticationController.js");

authRouter.post("/login", login);
authRouter.post("/signup", registerUser);
authRouter.get("/me", authenticate(), findById);
authRouter.post("/logout", authenticate(), logout);
//Temporarily commenting out this line
authRouter.post("/registerManager", authenticate("MANAGER"), registerManager);
authRouter.post("/bootstrap-manager", bootstrapManager);


module.exports = authRouter;

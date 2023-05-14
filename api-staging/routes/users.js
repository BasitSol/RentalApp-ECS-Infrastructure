const express = require("express");
const usersRouter = express.Router();

const {
  authenticate
} = require("../controllers/authenticationController.js");

const {
  get,
  create,
  update,
  findById,
  deleteUser
} = require("../controllers/userController.js")

usersRouter.get("/", authenticate("MANAGER"), get);
usersRouter.put("/:id", authenticate(), update);
usersRouter.get("/:id", authenticate(), findById);
usersRouter.post("/", authenticate("MANAGER"), create);
usersRouter.delete("/:id", authenticate("MANAGER"), deleteUser);

module.exports = usersRouter;

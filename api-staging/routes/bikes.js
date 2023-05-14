const express = require("express");
const bikeRouter = express.Router();

const {
  authenticate
} = require("../controllers/authenticationController.js");

const {
  create,
  update,
  getBikes,
  findById,
  deleteBike,
} = require("../controllers/bikesController.js");

bikeRouter.get("/", authenticate(), getBikes);
bikeRouter.get("/:id", authenticate(), findById);
bikeRouter.put("/:id", authenticate("MANAGER"), update);
bikeRouter.post("/", authenticate("MANAGER"), create);
bikeRouter.delete("/:id", authenticate("MANAGER"), deleteBike);

module.exports = bikeRouter;

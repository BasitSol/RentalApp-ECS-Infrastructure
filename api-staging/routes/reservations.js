const express = require("express");
const reservationRouter = express.Router();

const {
  authenticate
} = require("../controllers/authenticationController.js");

const {
  create,
  update,
  getDetails,
  getHistory,
  deleteReservation
} = require("../controllers/reservationController");

reservationRouter.post("/", authenticate("USER"), create);
reservationRouter.get("/", authenticate("MANAGER"), getDetails);
reservationRouter.get("/myReservation", authenticate(), getHistory);
reservationRouter.post("/submitReview", authenticate("USER"), update);
reservationRouter.post("/cancelReservation", authenticate("USER"), deleteReservation);

module.exports = reservationRouter;

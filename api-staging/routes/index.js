const authRouter = require("./auth");
const usersRouter = require("./users");
const bikeRouter = require("./bikes");
const reservationRouter = require("./reservations");

module.exports = {
  authRouter,
  bikeRouter,
  usersRouter,
  reservationRouter
};

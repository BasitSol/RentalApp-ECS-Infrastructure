const cors = require("cors");
const logger = require("morgan");
const session = require('express-session');
const express = require("express");
const passport = require('passport');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const initializePassport = require('./passport-config');
const {
  usersRouter,
  authRouter,
  bikeRouter,
  reservationRouter,
} = require("./routes/index");
const app = express();

const connection = mongoose.connect(
  'mongodb+srv://ahsherazkhan:sNxBavZdR4RS9koF@bikerentalappdb.llj25pm.mongodb.net/',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(connect => connect.connection.getClient());

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("db is connected!"));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

initializePassport(passport);

app.use(logger("dev"));

app.use(session({
  secret: '0987654321',
  resave: false,
  saveUninitialized : true,
  store: MongoStore.create({ clientPromise: connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/bikes", bikeRouter);
app.use("/api/users", usersRouter);
app.use("/api/reservation", reservationRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;

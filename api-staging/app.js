if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
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

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  console.error("CRITICAL ERROR: SESSION_SECRET must be set in production.");
  process.exit(1);
}

// Industry Best Practice: Resilient DB Connection with Promise Return for Sessions
const connectWithRetry = async () => {
  // Pulls securely from your .env file (and later, from Kubernetes)
  const dbURI = process.env.MONGODB_URI;
  
  // Edge Case: Fail fast if the environment variable is completely missing
  if (!dbURI) {
    console.error("❌ CRITICAL ERROR: MONGODB_URI is missing from your .env file!");
    process.exit(1); 
  }

  try {
    const m = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("🔥 db is connected securely!");
    return m.connection.getClient(); // Hand this to the session store
  } catch (err) {
    console.error("⚠️ Database connection failed. Retrying in 5 seconds...", err.message);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectWithRetry();
  }
};

const connectionPromise = connectWithRetry();

const toBool = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return String(value).toLowerCase() === "true";
};

const cookieSecure =
  process.env.SESSION_COOKIE_SECURE !== undefined
    ? toBool(process.env.SESSION_COOKIE_SECURE)
    : process.env.NODE_ENV === "production";

const cookieSameSite = process.env.SESSION_COOKIE_SAME_SITE ||
  (cookieSecure ? "none" : "lax");

// Behind Ingress/reverse-proxy, trust X-Forwarded-* headers for secure cookies.
app.set("trust proxy", 1);

app.use(cors({
  // Edge Case: Allow K8s Nginx OR local React to talk to this API
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

initializePassport(passport);

app.use(logger("dev"));

app.use(session({
  // Edge Case: Never hardcode secrets in production! Use process.env
  secret: process.env.SESSION_SECRET || '0987654321', 
  resave: false,
  saveUninitialized : false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    maxAge: Number(process.env.SESSION_MAX_AGE_MS || 86400000)
  },
  store: MongoStore.create({ clientPromise: connectionPromise }) // <-- Fixed variable!
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/bikes", bikeRouter);
app.use("/api/users", usersRouter);
app.use("/api/reservation", reservationRouter);

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/readyz", (req, res) => {
  const readyState = mongoose.connection.readyState;
  if (readyState === 1) {
    return res.status(200).json({ status: "ready" });
  }
  return res.status(503).json({ status: "not-ready", dbState: readyState });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;

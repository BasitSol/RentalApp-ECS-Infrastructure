const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true, dropDups: true },
  role: {
    type: String,
    enum: ["MANAGER", "USER"],
    default: "USER",
  },
  salt: { type: String },
  password: { type: String },
  reservationCount: { type: Number },
  },{ versionKey: false, timestamps: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

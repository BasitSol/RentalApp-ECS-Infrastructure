const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const bikeSchema = new mongoose.Schema({
  location: String,
  color: String,
  model: String,
  rating: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  isReserved: { type: Boolean, default: false },
},{ versionKey: false, timestamps: true }
);

bikeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Bike", bikeSchema);

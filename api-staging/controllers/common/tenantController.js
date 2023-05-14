const {
  hash,
  genSalt
} = require("bcrypt");

const getModels = require("../../models");

exports.getTimeParsed = time => time.split('"')[1];

exports.create = async (collection, data) =>
  await getModels[collection].create(data);

exports.paginate = async (collection, condition, options) =>
  await getModels[collection].paginate(condition, options);

exports.find = async (collection, condition) =>
  await getModels[collection].find(condition).lean().exec();

exports.findById = async (collection, id, select=null) =>
  await getModels[collection].findById(id).select(select).lean().exec();

exports.updateOne = async (collection, condition, payload) =>
  await getModels[collection].updateOne(condition, payload).lean().exec();

exports.findOne = async (collection, condition, select=null) =>
  await getModels[collection].findOne(condition).select(select).lean().exec();

exports.findByIdAndUpdate = async (collection, id, payload, select=null) =>
  await getModels[collection].findByIdAndUpdate(id, payload, { new: true }).select(select).lean().exec();

exports.extractId = (obj) =>
   typeof obj === "string" ? obj : typeof obj === "object" ? obj._id || String(obj) : obj;

exports.getAverageRating = (count=0, previousRating=0, newRating=0) =>
  (newRating + (count * previousRating))/(count+1);

exports.getEncryptedPassword = async (password, salt=null) => {
  if (!salt) salt = await genSalt(10);
  return {salt, encryptedPassword: await hash(password, salt)};
}

const deleteMany = (collection, condition) =>
  getModels[collection].deleteMany(condition).lean().exec();

exports.deleteOne = async (collection, obj) => {
  const Actions = Object.freeze({
    User: () => deleteMany('Reservation', {user: obj._id}),
    Bike: () => deleteMany('Reservation', {bike: obj._id}),
    Reservation: () => {},
  });

  Actions[collection]();
  return await getModels[collection].deleteOne(obj).lean().exec();
}
















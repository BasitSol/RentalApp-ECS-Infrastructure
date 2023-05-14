const {
  Reservations
} = require("../models");

const {
  DEFAULT,
  BIKE_UPDATED,
  BIKE_REMOVED,
  BIKES_NOT_FOUND
} = require("../consts");

const {
  find,
  create,
  paginate,
  findById,
  deleteOne,
  extractId,
  getTimeParsed,
  findByIdAndUpdate
} = require("./common/tenantController.js");

exports.create = (req, res) => {
  try {
    const { color, model, location } = req.body;

    create('Bike', { model, color, location }).then(bike =>
      res.status(200).send({ bike })
    );
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.deleteBike = (req, res) => {
  try {
    const { id } = req.params;

    deleteOne('Bike', { _id: id }).then(data =>
      res.status(200).send({ message: BIKE_REMOVED })
    );
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const properties = { model, color, location } = req.body;

    findById('Bike', id).then(bike => {
      if (!bike) return res.status(403).send({ message: BIKES_NOT_FOUND });
    })

    const payload = {};
    const setPayload = (field) => payload[field] = properties[field];
    Object.keys(properties).forEach(element =>
      properties[element] && setPayload(element)
    );

    findByIdAndUpdate('Bike', id, payload).then(data =>
      res.status(200).send({ message: BIKE_UPDATED })
    );
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.getBikes = (req, res) => {
  try {
    let { page=1, limit=20, startTime, endTime } = req.query;

    const filter = !!(startTime && endTime)
    if (filter) {
      startTime = getTimeParsed(startTime);
      endTime = getTimeParsed(endTime);
    }

    const options = { customLabels: { docs: "bikes" }, page, limit, sort: {createdAt: -1} };

    paginate('Bike', {}, options).then(async response => {
      let result = [];
      response.bikes.forEach(bike => result.push(extractId(bike)));

      if (!filter) {
        const reservations = await find('Reservation', {bike: { $in: result }});
        response.bikes = filterAvailablility(response.bikes, reservations, false);
        return res.status(200).send(response);
      }

      const reservations = await find('Reservation', {
        bike: { $in: result },
          $or: [
            { startTime: {$gte: startTime, $lte: endTime} },
            { endTime: {$gte: startTime, $lte: endTime} },
            {
              $and: [
                { startTime: {$lte: startTime} },
                { endTime: {$gte: endTime} }]
            }]
        })
      if (reservations.length) {
        response.bikes = filterAvailablility(response.bikes, reservations);
        return res.status(200).send(response);
      } else {
        return res.status(200).send(response);
      }
    });
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

const filterAvailablility = (data, dataToFilter, checkAvailablity=true) => {
  let result = [];

  checkAvailablity
  ? dataToFilter.forEach(filter => {
      result = data.filter(item => String(item._id) !== String(filter.bike));
      data = result;
    })
  : data.forEach(filter => {
      let exist = dataToFilter.find(item => String(item.bike) === String(filter._id));
      if (exist) {
        exist = filter;
        exist.isReserved = true;
      } else {
        exist = filter;
        exist.isReserved = false;
      }
      result.push(exist);
  })
  return result;
}

exports.findById = (req, res) => {
  try {
    const { id } = req.params;

    findById('Bike', id).then(bike =>
      res.status(200).send({ bike })
    );
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}



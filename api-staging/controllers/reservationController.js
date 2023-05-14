const {
  Reservation
} = require("../models");

const {
  DEFAULT,
  BIKE_RESERVED,
  BIKE_RESERVED_ERROR,
  RESERVATION_CANCEL,
  REVIEW_SUBMITTED
} = require("../consts");

const {
  create,
  findOne,
  findById,
  paginate,
  extractId,
  updateOne,
  deleteOne,
  getAverageRating
} = require("./common/tenantController.js");

exports.create = async (req, res) => {
  try {
    const { bikeId, startTime, endTime } = req.body;

    const userId = extractId(req.user);
    const [bike, reservation] = await Promise.all([
      findOne('Bike', { _id: bikeId, isReserved: true }),
      findOne('Reservation', { bike: bikeId,
        $or: [
          { startTime: {$gte: startTime, $lt: endTime} },
          { endTime: {$gte: startTime, $lt: endTime} },
          {
            $and: [
              { startTime: {$lt: startTime} },
              { endTime: {$gte: endTime} }]
          }]
        })
      ]);

    if (bike && reservation) {
      return res.status(200).send({ message: BIKE_RESERVED_ERROR})
    }

    await Promise.all([
      create('Reservation', {
          user: req.user._id,
          bike: bikeId,
          startTime,
          endTime,
          status: "InProgress"
        }),
      updateOne('Bike', {_id: bikeId}, { isReserved: true })
    ]);

    findById('User', userId).then(user => {
      if(user) {
        updateOne('User', { _id: userId },
        { reservationCount: (user.reservationCount || 0) + 1 })
          .then(data =>
            res.status(200).send({ message: BIKE_RESERVED })
          )
        }
    });
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.update = (req, res) => {
  try {
    const { _id, rating } = req.body;

    findOne("Reservation", {_id})
    .then(async reservation => {
      const bike = await findOne("Bike", {_id: reservation.bike});
      deleteOne("Reservation", {_id});
      updateOne("Bike", {_id: reservation.bike},
      {
        count: (bike.count + 1),
        rating: getAverageRating(bike.count, bike.rating, rating)
      })
      .then(data => res.status(200).send({ message: REVIEW_SUBMITTED }))
    })
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.getDetails = (req, res) => {
  try {
    paginate(
      'Reservation',
      {},
      { customLabels: { docs: "reservations" } }
    ).then(reservations => res.status(200).send(reservations));
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.getHistory = (req, res) => {
  try {
    const { userId, limit=66, page=1 } = req.query;

    paginate(
        'Reservation',
        { user: userId },
        {
          customLabels: { docs: "reservations" },
          populate: ["bike"], limit, page,
        }
      ).then(reservations => res.status(200).send(reservations));
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.deleteReservation = (req, res) => {
  const _id = extractId(req.body);
  deleteOne('Reservation', {_id})
  .then(res.status(200).send({ message: RESERVATION_CANCEL}))
  .catch(err => {
    res.status(500).send({ message: DEFAULT })
  })
}










const {
  DEFAULT,
  USER_EXISTS,
  EMAIL_EXISTS,
  USER_REMOVED,
  USER_ID_ERROR,
  USER_REGISTERED
} = require("../consts");

const {
  create,
  findOne,
  paginate,
  deleteOne,
  findByIdAndUpdate,
  getEncryptedPassword
} = require("./common/tenantController.js");

exports.create = (req, res, next) => {
    try {
      const { email, password, name , role='USER' } = req.body;
      const createUser = (salt, password) => {
        create('User', { email, name, password, salt, role }).then(user =>
          res.status(200).send({ message: USER_REGISTERED })
        );
      }

      findOne('User', { email }).then(user => {
        if (!!user) {
          return res.status(401).send({ message: EMAIL_EXISTS });
        } else {
          getEncryptedPassword(password)
          .then(({salt, encryptedPassword}) =>
            createUser(salt, encryptedPassword)
          )
        }
      });
    } catch (error) {
      res.status(500).send({ message: DEFAULT });
    }
}

exports.deleteUser = (req, res, next) => {
  try {
    const { id } = req.params;

    deleteOne('User', { _id: id }).then(data =>
      res.status(200).send({message: USER_REMOVED})
    );
  } catch (error) {
    res.status(500).send({ message: DEFAULT });
  }
}

exports.update = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const properties = Object.freeze({name, role, email});

    findOne('User', { _id: id }).then(user => {
      if (!user) return res.status(401).send({ message: USER_ID_ERROR });
    });

    const payload = {};
    const setPayload = (field) => payload[field] = properties[field];
    Object.keys(properties).forEach(element => properties[element] && setPayload(element))

    findByIdAndUpdate('User', id, payload, '-password -salt').then(updatedUser =>
      res.status(200).send({ ...updatedUser })
    );
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(500).send({ message: USER_EXISTS });
    } else {
      res.status(500).send({ message: DEFAULT });
    }
  }
}

exports.get = (req, res) => {
  try {
    const query = JSON.parse(req.query.query || `{}`);
    const { page=1, limit=40 } = req.query;

    paginate(
        'User',
        query,
        {
          customLabels: { docs: "users" },
          limit, page
        }
      ).then(users =>
      res.status(200).send(users)
    );
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;

    findById('User', id, '-password -salt').then(user =>
      res.status(200).send(user || {}));
  } catch (error) {
    return res.status(500).send({ message: DEFAULT });
  }
}




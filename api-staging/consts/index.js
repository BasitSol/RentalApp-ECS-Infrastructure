const ERRORS = {
  DEFAULT: "internal server error",
  PARAMS_ERROR: "Invalid params",
  UNAUTHORIZED: "UnAuthorized to Perfrom this action",
  INVALID_CREDIENTIALS: "Invalid email and password combination.",
  EMAIL_EXISTS: "Email already exists",

  BIKES_NOT_FOUND: "No bike registered with this id",
  BIKE_UPDATED: "Bike updated successfully",
  BIKE_REMOVED: "Bike deleted successfully",
  BIKE_RESERVED: "Bike reserved!",
  BIKE_RESERVED_ERROR: "Bike is Already Reserved",
  RESERVATION_CANCEL: "Reervation cancelled successfully",
  REVIEW_SUBMITTED:"Review submitted successfully",

  USER_REGISTERED: "User registered Successfully",
  USER_REMOVED: "User deleted Successfully",
  USER_ID_ERROR: "Invalid user id",
  USER_EXISTS: "User with this email is already exists",
  FORBIDDEN: "Unknown user",
  PASSSWORD_ERROR: "Invalid password",
};

module.exports = Object.freeze(ERRORS);

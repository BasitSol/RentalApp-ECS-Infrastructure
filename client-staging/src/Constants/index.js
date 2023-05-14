
export const MIN_NAME_CHARACTERS = 6;
export const MAX_NAME_CHARACTERS = 50;
export const MIN_PASSWORD_CHARACTERS = 8;
export const MAX_PASSWORD_CHARACTERS = 50;
export const SKELETON_LOAD_TIME = 250;
export const INITIAL_FILTER = { model: "", color: "", location: "", ratings: 0, condition: "" };
export const API_BASE_URL = "http://localhost:4000/api";
export const RATINGS = [1, 2, 3, 4, 5];
export const CONDITIONS = ['<', '>', '='];
export const DEFAULT_LIMIT = 100;

export const ROLES = [
  {
    label: "Manager",
    value: "MANAGER",
  },
  {
    label: "User",
    value: "USER",
  },
];

export const ALL_USERS_TABLE = [
  { title: "NAME", key: "name" },
  { title: "Email", key: "email" },
  { title: "Total Reservations", key: "reservationCount" },
  { title: "Role", key: "role" },
];

export const BOOKINGS_TABLE_HEADINGS = [
  { title: "Bike Model", key: "model" },
  { title: "Reserved From", key: "startTime" },
  { title: "Reserved Till", key: "endTime" },
  { title: "Status", key: "status" }
];

export const AVAILABLE_COLORS = [
  {
    label: "Red",
    value: "Red",
  },
  {
    label: "Yellow",
    value: "Yellow",
  },
  {
    label: "Pink",
    value: "Pink",
  },
  {
    label: "Black",
    value: "Black",
  },
  {
    label: "Blue",
    value: "Blue",
  },
];

export const AVAILABLE_MODELS = [
  {
    label: "Road Bike",
    value: "Road Bike",
  },
  {
    label: "Mountain Bike",
    value: "Mountain Bike",
  },
  {
    label: "Touring Bike",
    value: "Touring Bike",
  },
  {
    label: "Folding Bike",
    value: "Folding Bike",
  },
  {
    label: "Fixed Gear/ Track Bike",
    value: "Fixed Gear/ Track Bike",
  },
  {
    label: "BMX",
    value: "BMX",
  },
  {
    label: "Recumbent Bike",
    value: "Recumbent Bike",
  },
  {
    label: "Cyclocross Bike",
    value: "Cyclocross Bike",
  },
  {
    label: "Electric Bike",
    value: "Electric Bike",
  },
];

export const AVAILABLE_LOCATIONS = [
  {
    label: "California",
    value: "California",
  },
  {
    label: "Florida",
    value: "Florida",
  },
  {
    label: "Massachusetts",
    value: "Massachusetts",
  },
  {
    label: "Washington",
    value: "Washington",
  },
  {
    label: "Washington DC",
    value: "Washington DC",
  },
  {
    label: "Los Angeles",
    value: "Los Angeles",
  }
];

import { API_BASE_URL } from "../Constants";
import ApiServices from "./ApiServices";
import { bikes } from "./ApiServices/Urls";

export const getBikes = ({ startTime, endTime }) =>
  ApiServices.get(`${API_BASE_URL}${bikes}`, { startTime, endTime });

export const create = (payload) =>
  ApiServices.post(`${API_BASE_URL}${bikes}`, payload);

export const update = (payload, bikeId) =>
  ApiServices.put(`${API_BASE_URL}${bikes}/${bikeId}`, payload);

export const deleteBike = (bikeId) =>
  ApiServices.delete(`${API_BASE_URL}${bikes}/${bikeId}`);

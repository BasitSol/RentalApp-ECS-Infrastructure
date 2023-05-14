import { API_BASE_URL, DEFAULT_LIMIT } from "../Constants";
import ApiServices from "./ApiServices";
import { users } from "./ApiServices/Urls";

export const create = (payload) =>
  ApiServices.post(`${API_BASE_URL}${users}`, payload);

export const get = () =>
  ApiServices.get(`${API_BASE_URL}${users}`, { limit: DEFAULT_LIMIT });

export const deleteUser = (userId) =>
  ApiServices.delete(`${API_BASE_URL}${users}/${userId}`);

export const update = (payload, userId) =>
  ApiServices.put(`${API_BASE_URL}${users}/${userId}`, payload);

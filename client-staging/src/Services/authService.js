import { API_BASE_URL } from "../Constants";
import ApiServices from "./ApiServices";
import {
  login,
  signup
} from "./ApiServices/Urls";

export const signInService = payload =>
  ApiServices.post(`${API_BASE_URL}${login}`, payload);

export const signUpService = payload =>
  ApiServices.post(`${API_BASE_URL}${signup}`, payload);

export const logout = () =>
  ApiServices.post(`${API_BASE_URL}/`);

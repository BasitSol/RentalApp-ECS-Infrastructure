import { API_BASE_URL } from "../Constants";
import ApiServices from "./ApiServices";
import {
  cancelBooking, giveFeedBack,
  myReservation, reservation
} from "./ApiServices/Urls";

export const create = payload =>
  ApiServices.post(`${API_BASE_URL}${reservation}`, payload);

export const get = payload =>
  ApiServices.get(`${API_BASE_URL}${reservation}${myReservation}`, payload);

export const cancelReservation = payload =>
  ApiServices.post(`${API_BASE_URL}${reservation}${cancelBooking}`, payload);

export const submitReview = payload =>
  ApiServices.post(`${API_BASE_URL}${reservation}${giveFeedBack}`, payload);



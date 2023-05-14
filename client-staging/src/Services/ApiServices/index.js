import axios from "axios";
axios.defaults.withCredentials = true;

class ApiServices {

  static get = async (url, params) =>
    axios.get(url, { params });

  static post = (url, data) =>
    axios.post(url, data);

  static put = (url, data) =>
    axios.put(url, data);

  static delete = (url) =>
    axios.delete(url);
}

export default ApiServices;

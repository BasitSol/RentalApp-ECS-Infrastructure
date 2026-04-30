import axios from "axios";

// 1. Fix the Credentials (Essential for Sessions)
axios.defaults.withCredentials = true;

// 2. Set the Base URL (Essential for DevOps/K8s)
// This pulls from your .env file. In K8s, it will automatically
// point to your Nginx proxy.
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";

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
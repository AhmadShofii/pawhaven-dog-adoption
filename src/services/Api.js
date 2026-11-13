
import axios from "axios";

const api = axios.create({
  baseURL: "https://dog.ceo/api",
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

export default api;

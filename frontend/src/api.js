import axios from "axios";

const api = axios.create({
  baseURL: "https://shop-backend-85v0.onrender.com/api",
});

export default api;
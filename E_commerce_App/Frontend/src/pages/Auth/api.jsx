import axios from "axios";
const api = axios.create({
  baseURL: "https://e-cart-q4gx.onrender.com",
});
export const googleAuth = (code) =>  api.get(`/google?code=${encodeURIComponent(code)}`);

import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5001",
});
export const googleAuth = (code) =>  api.get(`/google?code=${encodeURIComponent(code)}`);

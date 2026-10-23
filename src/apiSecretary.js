import axios from "axios";

// Secretary requests use the HttpOnly secretary_session cookie, not the admin JWT.
const apiSecretary = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/hdga/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default apiSecretary;

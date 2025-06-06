import axios from "axios";

if (!process.env.MAIN_BACKEND_URL) {
  throw new Error("MAIN_BACKEND_URL must be set");
}
if (!process.env.MAIN_BACKEND_API_KEY) {
  throw new Error("MAIN_BACKEND_API_KEY must be set");
}

export const backendClient = axios.create({
  baseURL: process.env.MAIN_BACKEND_URL,
  headers: {
    "x-api-key": process.env.MAIN_BACKEND_API_KEY,
  },
});

backendClient.interceptors.request.use((cfg) => {
  // (optional) logging
  // console.log("[backendClient] →", cfg.method?.toUpperCase(), cfg.baseURL + cfg.url);
  return cfg;
});
backendClient.interceptors.response.use(
  (resp) => resp,
  (err) => Promise.reject(err)
);

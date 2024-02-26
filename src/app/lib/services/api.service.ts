import axios from "axios";
import { getAccount, getJWT } from "./appwrite.service";

export const api = axios.create({
  baseURL: "/api",
  timeout: 1200000,
  validateStatus: function (status) {
    return status >= 200 && status <= 505;
  },
});

api.interceptors.request.use(async function (request) {
  if (!request.headers.get("x-appwrite-user-jwt")) {
    const token = (await getJWT()).jwt;
    request.headers["x-appwrite-user-jwt"] = token;
    return request;
  }
  return request;
});

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      originalRequest._retry = true;
      return getJWT().then((jwt) => {
        originalRequest.headers["x-appwrite-user-jwt"] = jwt;
        return api(originalRequest);
      });
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

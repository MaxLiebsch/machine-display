import axios from "axios";
import { getJWT } from "./appwrite.service";

export const api = axios.create({
  baseURL: "/api",
  timeout: 1200000,
  validateStatus: function (status) {
    return status >= 200 && status <= 505;
  },
});

api.interceptors.request.use(async function (request) {
  const _token = sessionStorage.getItem("x-appwrite-user-jwt");
  if (!_token) {
    const token = (await getJWT()).jwt;
    sessionStorage.setItem("x-appwrite-user-jwt", token);
    request.headers["x-appwrite-user-jwt"] = token;
    return request;
  }else{
    request.headers["x-appwrite-user-jwt"] = _token;
  }
  return request;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      originalRequest._retry = true;
      return getJWT().then((jwt) => {
        originalRequest.headers["x-appwrite-user-jwt"] = jwt.jwt;
        sessionStorage.setItem("x-appwrite-user-jwt", jwt.jwt);
        return api(originalRequest);
      });
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

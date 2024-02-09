import axios from "axios";

export const backendapi = axios.create({
  baseURL: process.env.CRAWLER_BE,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status <= 505;
  },
  headers: {
    Authorization:
      "Basic " + btoa(process.env.BE_USER_NAME + ":" + process.env.BE_PASSWORD),
  },
});

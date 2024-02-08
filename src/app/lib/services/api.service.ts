import axios from "axios";
import { getAccount, getJWT } from "./appwrite.service";

export const api = axios.create({
  baseURL: "api/",
  timeout: 120000,
});

api.interceptors.request.use(
  async function (request){
    if(!request.headers['x-appwrite-user-jwt']){
      const token = (await getJWT()).jwt;
      request.headers['x-appwrite-user-jwt'] = token;
      return request
    }
    return request
  }
)

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
    //   getAccount()
    //     .then((account) => {
    //       const admin = account.labels.find((label) => label === "admin");
    //       if (admin) {
    //         getJWT()
    //           .then((token) => {
    //             console.log("token", token);
    //           })
    //           .catch();
    //       }
    //     })
    //     .catch();
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

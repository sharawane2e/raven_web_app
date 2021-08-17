import axios, { AxiosRequestConfig } from "axios";
import IApiResponse from "../types/IApiResponse";
import LocalStorageUtils from "./LocalStorageUtils";
import Toaster from "./Toaster";

type MethodType = "GET" | "POST" | "DELETE" | "PUT";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const token = LocalStorageUtils.getToken();
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = "bearer " + token;
}

const ApiRequest = {
  request: async function (
    url: string,
    method: MethodType,
    data?: any,
    params?: AxiosRequestConfig
  ) {
    let response: IApiResponse = { success: false, message: "", data: null };
    try {
      const apiResponse = await axiosInstance(url, {
        data,
        method,
        ...params,
      });
      response = apiResponse.data;
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          LocalStorageUtils.removeUser();
          window.location.href = `/login`;
          this.setAuthToken();
        } else if (error.response.status === 400) {
          response = error.response.data;
        } else if (error.response.status === 404) {
        } else {
          Toaster.error("Something went wrong");
        }
      }
    }
    return response;
  },

  setAuthToken: function (token?: string) {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] =
        "bearer " + token;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  },
};

export default ApiRequest;

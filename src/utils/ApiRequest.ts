import axios, { AxiosRequestConfig } from 'axios';
import IApiResponse from '../types/IApiResponse';
import LocalStorageUtils from './LocalStorageUtils';
import Toaster from './Toaster';
import { errorMessages } from '../constants/messages';
import { logOutUser } from '../services/AuthService';
import store from '../redux/store';
// import {
//   setChartLoading,
//   setFullScreenLoading,
// } from '../redux/actions/chartActions';
import { timeout } from './Utility';
import { accesskey } from '../constants/Variables';

export type MethodType = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const token = LocalStorageUtils.getToken() || accesskey;
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = 'bearer ' + token;
}
const { dispatch } = store;

const ApiRequest = {
  request: async function (
    url: string,
    method: MethodType,
    data?: any,
    params?: AxiosRequestConfig,
  ) {
    let response: IApiResponse = {
      success: false,
      message: errorMessages.SERVER_ERROR,
      data: null,
    };
    try {
      // dispatch(setChartLoading(true));
      const [apiResponse, timeoutResponse] = await Promise.all([
        axiosInstance(url, {
          data,
          method,
          ...params,
        }),
        timeout(0),
      ]);
      response = apiResponse.data;
      //dispatch(setChartLoading(false));
      //dispatch(setFullScreenLoading(false));
    } catch (error: any) {
      // dispatch(setChartLoading(false));
      //   dispatch(setFullScreenLoading(false));
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          logOutUser(false);
          this.setAuthToken();
        } else if (error.response.status === 400) {
          response = error.response.data;
        } else if (error.response.status === 404) {
        } else {
          Toaster.error(errorMessages.SERVER_ERROR);
        }
      }
    }
    return response;
  },

  setAuthToken: function (token?: string) {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] =
        'bearer ' + token;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },
};

export default ApiRequest;

import { accessTokenKey } from "../constants/Variables";

class LocalStorageUtils {
  static setAccessToken(token: string) {
    localStorage.setItem(accessTokenKey, token);
  }

  static removeAccessToken() {
    localStorage.removeItem(accessTokenKey);
  }

  static getToken() {
    return (
      localStorage.getItem(accessTokenKey) ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTUxN2JkYTFhMTNlYjVlNWY5OThhZTciLCJhY3RpdmUiOnRydWUsImlzQWRtaW4iOnRydWUsImlzS2V5QWRtaW4iOnRydWUsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjMzMDExODkzLCJleHAiOjMxNjMzMDExODkzfQ.1i_c1q6taQIEcgkELOUzFWKxXnBkgA8ADyh0SbGUwnU"
    );
  }
}
export default LocalStorageUtils;

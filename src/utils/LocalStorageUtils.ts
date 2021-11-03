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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTUxYTA0OTM5YzE5MTg3M2JmOWZlMzgiLCJhY3RpdmUiOnRydWUsImlzQWRtaW4iOnRydWUsImlzS2V5QWRtaW4iOnRydWUsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjM1OTM1MjEyLCJleHAiOjMxNjM1OTM1MjEyfQ.aBj3h5lqETlPdI_OvjSQNbaFqOoFm52Dw4avK8EhpJc"
    );
  }
}
export default LocalStorageUtils;

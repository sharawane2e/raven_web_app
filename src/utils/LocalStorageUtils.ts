import { accessTokenKey } from "../constants/Variables";

class LocalStorageUtils {
  static setAccessToken(token: string) {
    localStorage.setItem(accessTokenKey, token);
  }

  static removeAccessToken() {
    localStorage.removeItem(accessTokenKey);
  }

  static getToken() {
    return localStorage.getItem(accessTokenKey) || null;
  }
}
export default LocalStorageUtils;

import { localStorageVar } from "../constants/Variables";

class LocalStorageUtils {
  static setUser(user: any) {
    localStorage.setItem(localStorageVar, JSON.stringify(user));
  }

  static getUser() {
    const userString = localStorage.getItem(localStorageVar);
    return userString ? JSON.parse(userString) : null;
  }

  static removeUser() {
    localStorage.removeItem(localStorageVar);
  }

  static getToken() {
    const user = this.getUser();
    if (user) {
      return user.token;
    } else {
      return undefined;
    }
  }

  static isUserLoggedIn() {
    if (this.getToken()) return true;
    return false;
  }
}
export default LocalStorageUtils;

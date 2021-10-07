import ApiUrl from "../enums/ApiUrl";
import { setUserProfile } from "../redux/actions/userActions";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";
import LocalStorageUtils from "../utils/LocalStorageUtils";

export const logOutUser = () => {
  const uiBaseUrl = process.env.REACT_APP_UI_BASE_URL;
  LocalStorageUtils.removeAccessToken();

  store.dispatch(setUserProfile(null));
  window.location.href = `${uiBaseUrl}login`;

  ApiRequest.request(ApiUrl.LOGOUT, "POST").catch((error) =>
    console.log(error)
  );
};

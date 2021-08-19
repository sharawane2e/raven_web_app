import LocalStorageUtils from "../utils/LocalStorageUtils";

export const logOutUser = () => {
  const uiBaseUrl = process.env.REACT_APP_UI_BASE_URL;
  LocalStorageUtils.removeUser();

  window.location.href = `${uiBaseUrl}/login`;

  //   Some token deletion(from server) logic if required
};

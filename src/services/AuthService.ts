import LocalStorageUtils from "../utils/LocalStorageUtils";

export const logOutUser = () => {
  LocalStorageUtils.removeUser();

  window.location.href = `/login`;

  //   Some token deletion(from server) logic if required
};

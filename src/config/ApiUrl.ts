class ApiUrl {
  static LOGIN = "/auth/login";

  static FORGOT_PASSWORD = "/auth/forgot-password";

  static SET_PASSWORD = "/auth/set-password";

  static RESET_PASSWORD = "/auth/reset-password";

  static CHANGE_PASSWORD = "/auth/change-password";

  static USER = "/user";

  static ACTIVATE_USER = "/user/activate";

  static DEACTIVATE_USER = "/user/de-activate";

  static GRANT_ADMIN_ACCESS = "/user/grant-admin";

  static REMOVE_ADMIN_ACCESS = "/user/revoke-admin";

  static IS_EMAIL_UNIQUE = "/user/is-email-unique";

  static RESEND_ACTIVATION_MAIL = "/user/resend-activation-email";
}

export default ApiUrl;

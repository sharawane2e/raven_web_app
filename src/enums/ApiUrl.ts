enum ApiUrl {
  LOGIN = "/auth/login",

  FORGOT_PASSWORD = "/auth/forgot-password",

  SET_PASSWORD = "/auth/set-password",

  RESET_PASSWORD = "/auth/reset-password",

  CHANGE_PASSWORD = "/auth/change-password",

  USER = "/user",

  ACTIVATE_USER = "/user/activate",

  DEACTIVATE_USER = "/user/de-activate",

  GRANT_ADMIN_ACCESS = "/user/grant-admin",

  REMOVE_ADMIN_ACCESS = "/user/revoke-admin",

  IS_EMAIL_UNIQUE = "/user/is-email-unique",

  RESEND_ACTIVATION_MAIL = "/user/resend-activation-email",
}

export default ApiUrl;

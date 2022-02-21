enum ApiUrl {
  LOGIN = "/auth/login",

  LOGOUT = "/auth/logout",

  FORGOT_PASSWORD = "/auth/forgot-password",

  SET_PASSWORD = "/auth/set-password",

  RESET_PASSWORD = "/auth/reset-password",

  CHANGE_PASSWORD = "/auth/change-password",

  USER = "/user",

  SHOW_CONTENT_PAGE = "/user/show-content-page",

  ACTIVATE_USER = "/user/activate",

  DEACTIVATE_USER = "/user/de-activate",

  GRANT_ADMIN_ACCESS = "/user/grant-admin",

  REMOVE_ADMIN_ACCESS = "/user/revoke-admin",

  IS_EMAIL_UNIQUE = "/user/is-email-unique",

  RESEND_ACTIVATION_MAIL = "/user/resend-activation-email",

  FILTER = "/filters/2",

  QUESTION = "/question/2",

  BANNER_QUESTION = "/question/banner/2",

  CHART = "/chart",
}

export default ApiUrl;

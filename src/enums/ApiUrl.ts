enum ApiUrl {
  LOGIN = '/auth/login',

  LOGOUT = '/auth/logout',

  FORGOT_PASSWORD = '/auth/forgot-password',

  SET_PASSWORD = '/auth/set-password',

  RESET_PASSWORD = '/auth/reset-password',

  CHANGE_PASSWORD = '/auth/change-password',

  USER = '/user',

  SHOW_CONTENT_PAGE = '/user/show-content-page',

  ACTIVATE_USER = '/user/activate',

  DEACTIVATE_USER = '/user/de-activate',

  GRANT_ADMIN_ACCESS = '/user/grant-admin',

  REMOVE_ADMIN_ACCESS = '/user/revoke-admin',

  IS_EMAIL_UNIQUE = '/user/is-email-unique',

  RESEND_ACTIVATION_MAIL = '/user/resend-activation-email',

  FILTER = '/filters',

  QUESTION = '/question',

  BANNER_QUESTION = '/question/banner',

  CHART = '/chart',

  CHAPTERS = '/chapters',

  SAVE_CHART = 'user/save-chart',

  DELETE_CHART = 'user/delete-chart',
}

export default ApiUrl;

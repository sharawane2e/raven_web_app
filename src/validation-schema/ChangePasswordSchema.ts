import * as yup from 'yup';
import { errorMessages } from '../constants/messages';
import Regex from '../constants/Regex';

const ChangePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required(errorMessages.PASSWORD_REQUIRED),
  newPassword: yup
    .string()
    .required(errorMessages.PASSWORD_REQUIRED)
    .matches(Regex.PASSWORD, errorMessages.PASSWORD_INVALID),

  confirmNewPassword: yup
    .string()
    .required(errorMessages.PASSWORD_REQUIRED)
    .matches(Regex.PASSWORD, errorMessages.PASSWORD_INVALID)
    .test('passwords-match', errorMessages.PASSWORD_MATCH, function (value) {
      return !this.parent.newPassword || this.parent.newPassword === value;
    }),
});

export default ChangePasswordSchema;

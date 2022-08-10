import * as yup from 'yup';
import { errorMessages } from '../constants/messages';
import Regex from '../constants/Regex';

const SetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required(errorMessages.PASSWORD_REQUIRED)
    .matches(Regex.PASSWORD, errorMessages.PASSWORD_INVALID),

  confirmPassword: yup
    .string()
    .required(errorMessages.PASSWORD_REQUIRED)
    .matches(Regex.PASSWORD, errorMessages.PASSWORD_INVALID)
    .test('passwords-match', errorMessages.PASSWORD_MATCH, function (value) {
      return !this.parent.password || this.parent.password === value;
    }),
});

export default SetPasswordSchema;

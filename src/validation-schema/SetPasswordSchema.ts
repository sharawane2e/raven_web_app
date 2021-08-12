import * as yup from "yup";
import { errorMessages } from "../constants/Messages";
import Regex from "../constants/Regex";

const SetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required(errorMessages.PASSWORD_REQUIRED)
    .matches(Regex.PASSWORD, errorMessages.PASSWORD_INVALID),
  confirmPassword: yup
    .string()
    .required(errorMessages.PASSWORD_REQUIRED)
    .matches(Regex.PASSWORD, errorMessages.PASSWORD_INVALID),
});

export default SetPasswordSchema;

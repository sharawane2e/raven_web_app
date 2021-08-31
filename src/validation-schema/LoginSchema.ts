import * as yup from "yup";
import { errorMessages } from "../constants/messages";
import Regex from "../constants/Regex";

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required(errorMessages.EMAIL_REQUIRED)
    .matches(Regex.EMAIL, errorMessages.EMAIL_INVALID),
  password: yup.string().required(errorMessages.PASSWORD_REQUIRED),
});

export default LoginSchema;

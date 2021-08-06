import * as yup from "yup";
import { errorMessages } from "../constants/Messages";

const LoginSchema = yup.object().shape({
  email: yup.string().required(errorMessages.EMAIL_REQUIRED),
  password: yup.string().required(errorMessages.PASSWORD_REQUIRED),
});

export default LoginSchema;

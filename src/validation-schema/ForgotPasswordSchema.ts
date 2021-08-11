import * as yup from "yup";
import { errorMessages } from "../constants/Messages";
import Regex from "../constants/Regex";

const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required(errorMessages.EMAIL_REQUIRED)
    .matches(Regex.EMAIL, errorMessages.EMAIL_INVALID),
});

export default ForgotPasswordSchema;

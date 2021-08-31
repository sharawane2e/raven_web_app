import * as yup from "yup";
import { errorMessages } from "../constants/messages";
import Regex from "../constants/Regex";

const AddUserSchema = yup.object().shape({
  firstName: yup.string().required(errorMessages.FIRSTNAME_REQUIRED),
  lastName: yup.string(),
  email: yup
    .string()
    .required(errorMessages.EMAIL_REQUIRED)
    .matches(Regex.EMAIL, errorMessages.EMAIL_INVALID),
  isAdmin: yup.boolean(),
});

export default AddUserSchema;

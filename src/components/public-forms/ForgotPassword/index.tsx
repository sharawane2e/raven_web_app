import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ApiUrl from "../../../config/ApiUrl";
import withLoader, { WithLoaderProps } from "../../../hoc/withLoader";
import ApiRequest from "../../../utils/ApiRequest";
import Toaster from "../../../utils/Toaster";
import ForgotPasswordSchema from "../../../validation-schema/ForgotPasswordSchema";
import InputField from "../../widgets/InputFields";

export interface ForgotPasswordProps extends WithLoaderProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: any) => {
    props.startLoading("Sending Email");

    ApiRequest.request(ApiUrl.FORGOT_PASSWORD, "POST", data)
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  return (
    <div className="forgot-password public-form">
      <form className="public-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="public-form__heading">Forgot your password?</div>

        <InputField
          {...register("email")}
          id="email"
          required
          label="Email"
          error={!!errors.email}
          helperText={errors?.email?.message}
          onChange={() => clearErrors("email")}
        />

        <Button type="submit" className="button--primary">
          Reset Password
        </Button>
        <Link to="/login" className="public-form__link">
          Back to login
        </Link>
      </form>
    </div>
  );
};

export default withLoader(ForgotPassword);

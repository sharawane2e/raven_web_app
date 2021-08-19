import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import ApiUrl from "../../../config/ApiUrl";
import withLoader, { WithLoaderProps } from "../../../hoc/withLoader";
import ApiRequest from "../../../utils/ApiRequest";
import Toaster from "../../../utils/Toaster";
import SetPasswordSchema from "../../../validation-schema/SetPasswordSchema";
import InputField from "../../widgets/InputFields";
import { parse } from "query-string";

export interface SetPasswordProps extends WithLoaderProps {
  variant: "set" | "reset";
}

const SetPassword: React.FC<SetPasswordProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(SetPasswordSchema),
    mode: "all",
  });

  const history = useHistory();
  const location = useLocation();
  const { email, token } = parse(location.search);

  const text =
    props.variant === "set"
      ? {
          heading: "Set password",
          button: "Activate account",
        }
      : {
          heading: "Reset password",
          button: "Save password",
        };

  const onSubmit = (data: any) => {
    props.startLoading();
    const url =
      props.variant === "set" ? ApiUrl.SET_PASSWORD : ApiUrl.RESET_PASSWORD;

    ApiRequest.request(url, "POST", {
      email,
      token,
      password: data.password,
    })
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          history.push("/login");
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  return (
    <div className="set-password public-form">
      <form className="public-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="public-form__heading">{text.heading}</div>

        <InputField
          {...register("password")}
          id="password"
          label="Password"
          required
          error={!!errors.password}
          helperText={errors?.password?.message}
          type="password"
          onChange={() => clearErrors("password")}
        />
        <InputField
          {...register("confirmPassword")}
          id="confirmPassword"
          label="Confirm Password"
          required
          error={!!errors.confirmPassword}
          helperText={errors?.confirmPassword?.message}
          type="password"
          onChange={() => clearErrors("confirmPassword")}
        />
        <Button type="submit" className="button--primary">
          {text.button}
        </Button>
        {props.variant === "reset" && (
          <Link className="public-form__link" to="/login">
            Back to login
          </Link>
        )}
      </form>
    </div>
  );
};

export default withLoader(SetPassword);

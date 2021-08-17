import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoginSchema from "../../../validation-schema/LoginSchema";
import InputField from "../../widgets/InputFields";
import { Link, useHistory } from "react-router-dom";
import withLoader, { WithLoaderProps } from "../../../hoc/withLoader";
import ApiRequest from "../../../utils/ApiRequest";
import ApiUrl from "../../../config/ApiUrl";
import Toaster from "../../../utils/Toaster";
import LocalStorageUtils from "../../../utils/LocalStorageUtils";

export interface LoginProps extends WithLoaderProps {}

const Login: React.FC<LoginProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onBlur",
  });

  const history = useHistory();

  const onSubmit = (data: any) => {
    props.startLoading("Logging in");

    ApiRequest.request(ApiUrl.LOGIN, "POST", data)
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          ApiRequest.setAuthToken(res.data?.accessToken);
          LocalStorageUtils.setUser(res.data);
          history.push("/home");
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  return (
    <div className="login public-form">
      <form className="public-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="public-form__heading">Login</div>

        <InputField
          {...register("email")}
          id="email"
          required
          label="Email"
          error={!!errors.email}
          helperText={errors?.email?.message}
        />
        <InputField
          {...register("password")}
          id="password"
          label="Password"
          required
          error={!!errors.password}
          helperText={errors?.password?.message}
          type="password"
        />

        <Button type="submit" className="button--primary">
          Login
        </Button>
        <Link className="public-form__link" to="/forgot-password">
          Lost your password?
        </Link>
      </form>
    </div>
  );
};

export default withLoader(Login);

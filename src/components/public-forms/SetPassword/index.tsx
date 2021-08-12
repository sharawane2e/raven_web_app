import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import withLoader, { WithLoaderProps } from "../../../hoc/withLoader";
import ForgotPasswordSchema from "../../../validation-schema/ForgotPasswordSchema";
import InputField from "../../widgets/InputFields";

export interface SetPasswordProps extends WithLoaderProps {}

const SetPassword: React.FC<SetPasswordProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onBlur",
  });

  return (
    <div className="set-password public-form">
      <form className="public-form__form">
        <div className="public-form__heading">Reset password</div>

        <InputField
          {...register("password")}
          id="password"
          label="Password"
          required
          error={!!errors.password}
          helperText={errors?.password?.message}
          type="password"
        />
        <InputField
          {...register("confirmPassword")}
          id="password"
          label="Confirm Password"
          required
          error={!!errors.password}
          helperText={errors?.password?.message}
          type="password"
        />
        <Button type="submit" className="button--primary">
          Save password
        </Button>
        <Link className="public-form__link" to="/login">
          Back to login
        </Link>
      </form>
    </div>
  );
};

export default withLoader(SetPassword);

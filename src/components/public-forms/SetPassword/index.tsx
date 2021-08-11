import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
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
      </form>
    </div>
  );
};

export default withLoader(SetPassword);

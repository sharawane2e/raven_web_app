import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import ApiUrl from "../../config/ApiUrl";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import ApiRequest from "../../utils/ApiRequest";
import LocalStorageUtils from "../../utils/LocalStorageUtils";
import Toaster from "../../utils/Toaster";
import ChangePasswordSchema from "../../validation-schema/ChangePasswordSchema";
import InputField from "../widgets/InputFields";

export interface ChangePasswordProps extends WithLoaderProps {}

const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    mode: "onBlur",

    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: any) => {
    debugger;
    const user = LocalStorageUtils.getUser();
    const url = `${ApiUrl.CHANGE_PASSWORD}/${user._id}`;
    props.startLoading();
    ApiRequest.request(url, "PATCH", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
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
    <div className="change-password">
      <div className="user-panel__page-title">Change password</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          {...register("oldPassword")}
          id="oldPassword"
          label="Old Password"
          required
          error={!!errors.oldPassword}
          helperText={errors?.oldPassword?.message}
          type="password"
          //   onChange={() => clearErrors("oldPassword")}
        />
        <InputField
          {...register("newPassword")}
          id="newPassword"
          label="New Password"
          required
          error={!!errors.newPassword}
          helperText={errors?.newPassword?.message}
          type="password"
          //   onChange={() => clearErrors("newPassword")}
        />
        <InputField
          {...register("confirmNewPassword")}
          id="confirmNewPassword"
          label="Confirm New Password"
          required
          error={!!errors.confirmNewPassword}
          helperText={errors?.confirmNewPassword?.message}
          type="password"
          //   onChange={() => clearErrors("confirmNewPassword")}
        />
        <Button type="submit" className="button--primary">
          Change password
        </Button>
      </form>
    </div>
  );
};

export default withLoader(ChangePassword);

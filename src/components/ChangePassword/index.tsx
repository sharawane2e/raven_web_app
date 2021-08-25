import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import ApiUrl from "../../config/ApiUrl";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import ApiRequest from "../../utils/ApiRequest";
import LocalStorageUtils from "../../utils/LocalStorageUtils";
import Toaster from "../../utils/Toaster";
import ChangePasswordSchema from "../../validation-schema/ChangePasswordSchema";
import Breadcrum from "../widgets/Breadcrum";
import InputField from "../widgets/InputFields";

export interface ChangePasswordProps extends WithLoaderProps {}
type FormType = "oldPassword" | "newPassword" | "confirmNewPassword";
const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
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

  const handleChange = (event: any, field: FormType) => {
    clearErrors(field);
    setValue(field, event.target.value);
  };

  return (
    <div className="change-password">
      <Breadcrum pageTitle="User" />
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
          onChange={(e) => handleChange(e, "oldPassword")}
        />
        <InputField
          {...register("newPassword")}
          id="newPassword"
          label="New Password"
          required
          error={!!errors.newPassword}
          helperText={errors?.newPassword?.message}
          type="password"
          onChange={(e) => handleChange(e, "newPassword")}
          showLabelInfo
        />
        <InputField
          {...register("confirmNewPassword")}
          id="confirmNewPassword"
          label="Confirm New Password"
          required
          error={!!errors.confirmNewPassword}
          helperText={errors?.confirmNewPassword?.message}
          type="password"
          onChange={(e) => handleChange(e, "confirmNewPassword")}
          showLabelInfo
        />
        <Button type="submit" className="button--primary">
          Change password
        </Button>
      </form>
    </div>
  );
};

export default withLoader(ChangePassword);

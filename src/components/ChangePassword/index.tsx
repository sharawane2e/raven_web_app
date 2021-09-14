import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import ApiUrl from "../../enums/ApiUrl";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import { RootState } from "../../redux/store";
import ApiRequest from "../../utils/ApiRequest";
import Toaster from "../../utils/Toaster";
import ChangePasswordSchema from "../../validation-schema/ChangePasswordSchema";
import Breadcrum from "../widgets/Breadcrum";
import InputField from "../widgets/InputFields";

export interface ChangePasswordProps extends WithLoaderProps {}

type FormType = "oldPassword" | "newPassword" | "confirmNewPassword";

const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const { profile } = useSelector((state: RootState) => state.user);
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
  const history = useHistory();

  const onSubmit = (data: any) => {
    const url = `${ApiUrl.CHANGE_PASSWORD}/${profile?._id}`;
    props.startLoading();
    ApiRequest.request(url, "PATCH", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          history.push("/home");
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

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControlLabel } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import ApiUrl from "../../config/ApiUrl";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import ApiRequest from "../../utils/ApiRequest";
import Toaster from "../../utils/Toaster";
import AddUserSchema from "../../validation-schema/AddUserSchema";
import InputField from "../widgets/InputFields";
import Checkbox from "@material-ui/core/Checkbox";

export interface AddUserProps extends WithLoaderProps {}

const AddUser: React.FC<AddUserProps> = (props) => {
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddUserSchema),
    mode: "onBlur",

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      isAdmin: false,
    },
  });

  const history = useHistory();

  const onSubmit = (data: any) => {
    props.startLoading();

    ApiRequest.request(ApiUrl.USER, "POST", data)
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          history.push("/admin/user-details");
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => props.stopLoading());
  };

  return (
    <div className="add-user">
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="add-user__heading">Add user</div>

        <InputField
          {...register("firstName")}
          id="firstName"
          required
          label="First name"
          error={!!errors.firstName}
          helperText={errors?.firstName?.message}
          onChange={() => {
            clearErrors("firstName");
          }}
        />
        <InputField
          {...register("lastName")}
          id="lastName"
          label="Last name"
          error={!!errors.lastName}
          helperText={errors?.lastName?.message}
        />
        <InputField
          {...register("email")}
          id="email"
          required
          label="Email"
          error={!!errors.email}
          helperText={errors?.email?.message}
          onChange={() => {
            clearErrors("email");
          }}
        />

        <Controller
          control={control}
          name="isAdmin"
          render={({ field }) => (
            <FormControlLabel
              label="Is admin"
              control={<Checkbox {...field} />}
            />
          )}
        />
        <div>{errors?.isAdmin?.message} </div>

        <Button type="submit" className="button--primary">
          Add user
        </Button>
      </form>
    </div>
  );
};

export default withLoader(AddUser);

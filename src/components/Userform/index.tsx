import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControlLabel } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import AddUserSchema from "../../validation-schema/AddUserSchema";
import InputField from "../widgets/InputFields";
import Checkbox from "@material-ui/core/Checkbox";
import { useEffect } from "react";

export interface UserFormProps extends WithLoaderProps {
  onSubmit: (data: any) => void;
  user?: any | null;
  submitText?: string;
}
type FormType = "email" | "firstName" | "lastName" | "isAdmin";
const UserForm: React.FC<UserFormProps> = (props) => {
  const { onSubmit, user, submitText } = props;
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddUserSchema),
    mode: "all",
    criteriaMode: "all",
    reValidateMode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      isAdmin: false,
    },
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("isAdmin", user.isAdmin);
    }
  }, [user]);

  const handleChange = (event: any, field: FormType) => {
    clearErrors(field);
    setValue(field, event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          {...register("firstName")}
          id="firstName"
          required
          label="First name"
          error={!!errors.firstName}
          helperText={errors?.firstName?.message}
          onChange={(e) => handleChange(e, "firstName")}
        />
        <InputField
          {...register("lastName")}
          id="lastName"
          label="Last name"
          error={!!errors.lastName}
          helperText={errors?.lastName?.message}
          onChange={(e) => handleChange(e, "lastName")}
        />
        <InputField
          {...register("email")}
          id="email"
          required
          label="Email"
          error={!!errors.email}
          helperText={errors?.email?.message}
          onChange={(e) => handleChange(e, "email")}
          InputProps={{ readOnly: user && !user.pending }}
        />

        <Controller
          control={control}
          name="isAdmin"
          render={({ field }) => (
            <FormControlLabel
              label="Is admin"
              control={<Checkbox {...field} disableRipple />}
              checked={field.value}
              disabled={user && user.isKeyAdmin}
            />
          )}
        />
        <div>{errors?.isAdmin?.message} </div>

        <Button type="submit" className="button--primary">
          {submitText ? submitText : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default withLoader(UserForm);

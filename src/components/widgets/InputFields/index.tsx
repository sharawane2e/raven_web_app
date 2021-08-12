import { TextFieldProps, TextField } from "@material-ui/core";
import clsx from "clsx";
import { forwardRef } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useState } from "react";

export interface InputFieldProps {}

const InputField = forwardRef<
  HTMLInputElement,
  InputFieldProps & TextFieldProps
>((props, ref) => {
  const { InputLabelProps: labelProps } = props;

  const [showPassword, setShowPassword] = useState(false);

  const endAdornment =
    props.type === "password" ? (
      showPassword ? (
        <VisibilityOffIcon
          onClick={() => setShowPassword(false)}
          className="input-field__endontment-icon"
        />
      ) : (
        <VisibilityIcon
          onClick={() => setShowPassword(true)}
          className="input-field__endontment-icon"
        />
      )
    ) : undefined;

  return (
    <>
      <label
        htmlFor={props.id}
        className={clsx("input-field__label", labelProps?.className)}
      >
        {props.label}
        {props.required && (
          <span className="input-field__required-asteric">*</span>
        )}
      </label>
      <TextField
        inputRef={ref}
        variant="outlined"
        {...props}
        type={
          props.type === "password"
            ? showPassword
              ? "text"
              : "password"
            : props.type
        }
        label={undefined}
        InputLabelProps={undefined}
        required={undefined}
        autoComplete="off"
        InputProps={{
          endAdornment,
          ...props.InputProps,
        }}
      />
    </>
  );
});

export default InputField;

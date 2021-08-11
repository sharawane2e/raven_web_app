import { TextFieldProps, TextField } from "@material-ui/core";
import clsx from "clsx";
import { forwardRef } from "react";

export interface InputFieldProps {}

const InputField = forwardRef<
  HTMLInputElement,
  InputFieldProps & TextFieldProps
>((props, ref) => {
  const { InputLabelProps: labelProps } = props;
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
        label={undefined}
        InputLabelProps={undefined}
        required={undefined}
        autoComplete="off"
      />
    </>
  );
});

export default InputField;

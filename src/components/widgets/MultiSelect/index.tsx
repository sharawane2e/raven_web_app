import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
} from "@material-ui/core";
import { memo } from "react";

export interface IMultiSelectOptions {
  /**
   * value to be stored as selection result
   */
  value: any;
  /**
   * label to be displayed as option
   */
  label: string;
}

interface MultiSelectProps extends SelectProps {
  /**
   * options to be rendered inside menu
   */
  options: IMultiSelectOptions[];
  /**
   * value of the multi select
   */
  value: any[];
}

const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  const { options, value, label } = props;

  return (
    <FormControl variant="outlined">
      <InputLabel>{label}</InputLabel>

      <Select
        {...props}
        input={<Input />}
        renderValue={(selected) => (selected as string[]).join(", ")}
        multiple
        //   MenuProps={MenuProps}
      >
        {options.map((option, index: number) => (
          <MenuItem key={index} value={option.value}>
            <Checkbox checked={value?.indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(MultiSelect);

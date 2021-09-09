import {
  Checkbox,
  FormControl,
  Input,
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
    <>
      <label htmlFor="input-elem">hello</label>
      <FormControl>
        <Select
          multiple
          displayEmpty
          native
          value={value?.length ? value : []}
          input={<Input id="input-elem" />}
          renderValue={(selected) => {
            if ((selected as string[]).length === 0) {
              return <em>Placeholder</em>;
            }

            return (selected as string[]).join(", ");
          }}
          // MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            <em>Placeholder</em>
          </MenuItem>
          {options.map((option, index: number) => (
            // @ts-ignore
            <MenuItem key={index} value={option}>
              <Checkbox checked={value?.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <FormControl variant="outlined">
      </FormControl> */}
    </>
  );
};

export default memo(MultiSelect);

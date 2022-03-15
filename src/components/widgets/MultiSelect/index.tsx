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
import CustomScrollbar from "../../CustomScrollbar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IQuestionOption } from "../../../types/IBaseQuestion";

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
// @ts-ignore
interface MultiSelectProps extends SelectProps {
  /**
   * options to be rendered inside menu
   */
  options: IQuestionOption[];
  /**
   * value of the multi select
   */
  value: IQuestionOption[];

  onChange: (values: IQuestionOption) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  const { options, value = [], label } = props;
  console.log("value",value)

  return (
    <FormControl className="multi-select">
      <label htmlFor="input-elem">{label}</label>
      <Select
        multiple
        open={props.open}
        displayEmpty
        value={value}
        input={<Input />}
        defaultChecked={true}
        renderValue={(selected) => {
          if ((selected as IQuestionOption[]).length === 0) {
            return <em>{props.placeholder || "Please select"}</em>;
          }

          return (selected as IQuestionOption[])
            .map((selectedValue) => {
              return selectedValue?.labelText;
            })
            .join(", ");
        }}
        IconComponent={ExpandMoreIcon}
        disableUnderline
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{
          className: "multi-select__paper",
          disablePortal: true,
          elevation: 1,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        <CustomScrollbar autoHeight>
          <MenuItem disabled value="" className="multi-select__placeholder">
            <em>{props.placeholder || "Please select"}</em>
          </MenuItem>
          {options?.map((option, optionIndex) => (
            <MenuItem
              key={optionIndex}
              // @ts-ignore
              value={option}
              onClick={() => {
                props.onChange !== undefined && props?.onChange(option);
              }}
            >
              <Checkbox
                checked={value?.some(
                  (filterValue) => filterValue?.labelCode === option.labelCode
                )}
              />
              <ListItemText primary={option.labelText} />
            </MenuItem>
          ))}
        </CustomScrollbar>
      </Select>
    </FormControl>
  );
};

export default memo(MultiSelect);

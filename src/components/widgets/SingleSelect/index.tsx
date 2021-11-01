import { FormControl, MenuItem, Select, SelectProps } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import CustomScrollbar from "../../CustomScrollbar";

interface SingleSelectProps extends SelectProps {
  options: any[];
  placeholder?: string;
  /**
   * key to be used to extract value from options
   */
  valueKey?: string;
  /**
   * key to be used to extract label from options
   */
  labelKey?: string;
  /**
   * event handler for menu item selection
   */
  onItemSelect?: (value: any) => void;

  disabledPredicate?: (value: any) => boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = (props) => {
  const { value, placeholder, options, labelKey, valueKey, onItemSelect } =
    props;
  return (
    <FormControl variant="outlined" className="single-select">
      <Select
        value={value}
        // onChange={onChange}
        displayEmpty
        className={props.className}
        disabled={props.disabled}
        inputProps={{ "aria-label": "Without label" }}
        IconComponent={ExpandMoreIcon}
        MenuProps={{
          elevation: 1,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          MenuListProps: {
            className: "single-select__menu-list",
          },
          ...props.MenuProps,
        }}
        renderValue={(selected) => {
          if (!selected) {
            return <span>{placeholder ? placeholder : "Please select"}</span>;
          }
          if (valueKey && labelKey) {
            const label = options.find(
              (option) => option[valueKey] === selected
            )[labelKey];
            return <span>{label ? label : ""}</span>;
          }
          return <span>{selected as any}</span>;
        }}
      >
        <CustomScrollbar autoHeight>
          <MenuItem value="" disabled>
            {placeholder ? placeholder : "Please select"}
          </MenuItem>
          {options?.map((option: any, index: number) => {
            const optionVal = valueKey ? option[valueKey] : option;
            return (
              <MenuItem
                key={index}
                value={optionVal}
                className={clsx({
                  "selected-value": optionVal === value,
                })}
                onClick={() => onItemSelect && onItemSelect(optionVal)}
                disabled={
                  props.disabledPredicate && props?.disabledPredicate(optionVal)
                }
              >
                {labelKey ? option[labelKey] : option}
              </MenuItem>
            );
          })}
        </CustomScrollbar>
      </Select>
    </FormControl>
  );
};

export default SingleSelect;

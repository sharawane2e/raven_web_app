import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Input,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
} from '@material-ui/core';
import { memo, useState } from 'react';
import CustomScrollbar from '../../CustomScrollbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IQuestionOption } from '../../../types/IBaseQuestion';
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
  onSelectAll: (values: IQuestionOption[]) => void;
}
const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  let { options, value = [], label } = props;
  const selectAll = (event: any) => {
    if (event.target.checked) {
      props.onSelectAll(options);
    } else {
      props.onSelectAll([]);
    }
  };
  return (
    <FormControl className="multi-select">
      <label htmlFor="input-elem">{label}</label>
      <Select
        multiple
        open={props.open}
        displayEmpty
        value={value}
        input={<Input />}
        renderValue={(selected) => {
          if ((selected as IQuestionOption[]).length === 0) {
            return <em>{props.placeholder || 'Please select'}</em>;
          }
          return (selected as IQuestionOption[])
            .map((selectedValue) => {
              return selectedValue?.labelText;
            })
            .join(', ');
        }}
        IconComponent={ExpandMoreIcon}
        disableUnderline
        inputProps={{ 'aria-label': 'Without label' }}
        MenuProps={{
          className: 'multi-select__paper',
          disablePortal: true,
          elevation: 1,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        <CustomScrollbar autoHeight>
          <MenuItem disabled value="" className="multi-select__placeholder">
            <em>{props.placeholder || 'Please select'}</em>
          </MenuItem>
          <MenuItem value="" className="multi-select__placeholder">
            <FormControlLabel
              className="multi-select__checkbox"
              control={
                <Checkbox
                  checked={options.length == value.length}
                  onChange={selectAll}
                />
              }
              label="Select All"
            />
          </MenuItem>
          {options?.map((option, optionIndex) => {
            return (
              <>
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
                      (filterValue) =>
                        filterValue?.labelCode === option.labelCode,
                    )}
                  />
                  <ListItemText primary={option.labelText} />
                </MenuItem>
              </>
            );
          })}
        </CustomScrollbar>
      </Select>
    </FormControl>
  );
};
export default memo(MultiSelect);

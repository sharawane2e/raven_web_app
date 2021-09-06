import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Fragment, useContext } from "react";
import { FilterContext } from "../../../../contexts/FilterContext";

const ChartSidebarContent: React.FC = () => {
  const { filterList, filters } = useContext(FilterContext);

  return (
    <div>
      <div>
        {filterList.map((filter, filterIndex) => (
          <Fragment key={filterIndex}>
            <FormControl /* className={classes.formControl} */>
              <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                // value={personName}
                // onChange={handleChange}
                input={<Input />}
                renderValue={(selected) => (selected as string[]).join(", ")}
                // MenuProps={MenuProps}
              >
                {filter.options.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.labelCode}>
                    <Checkbox /* checked={personoption.indexOf(option) > -1}  */
                    />
                    <ListItemText primary={option.labelText} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChartSidebarContent;

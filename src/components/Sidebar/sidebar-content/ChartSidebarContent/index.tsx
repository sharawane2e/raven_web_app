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
  const { filterList, filters, setFilters } = useContext(FilterContext);

  const handleFilterSelect = (qId: string, value: string[]) => {
    const newFilters = filters.filter((filter) => {
      //   console.log(qId, filter.code, value.indexOf(filter.code) > -1);
      //   if()

      return filter.qId !== qId || value.indexOf(filter.code) < 0;
    });

    value.forEach((code) => {
      newFilters.push({
        //   @ts-ignore
        label: filterList
          .find((filter) => filter.qId === qId)
          ?.options.find((option) => option.labelCode === code)?.labelText,
        code,
        qId,
      });
    });

    setFilters(newFilters);
  };

  return (
    <div className="chart-sidebar">
      <div className="chart-sidebar__filter-wrapper">
        {filterList.map((filter, filterIndex) => (
          <Fragment key={filterIndex}>
            <FormControl /* className={classes.formControl} */>
              <InputLabel id="demo-mutiple-checkbox-label">
                {filter.label}
              </InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={filters
                  .filter((selectedFilter) => selectedFilter.qId === filter.qId)
                  .map((selectedFilter) => selectedFilter.code)}
                //   @ts-ignore
                onChange={(e: any, d) => {
                  handleFilterSelect(filter.qId, e.target.value);
                }}
                input={<Input />}
                renderValue={(selected) => (selected as string[]).join(", ")}
                // MenuProps={MenuProps}
              >
                {filter.options.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.labelCode}>
                    <Checkbox
                      checked={
                        filters
                          .filter(
                            (selectedFilter) =>
                              selectedFilter.qId === filter.qId
                          )
                          .map((selectedFilter) => selectedFilter.code)
                          .indexOf(option.labelCode) > -1
                      }
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

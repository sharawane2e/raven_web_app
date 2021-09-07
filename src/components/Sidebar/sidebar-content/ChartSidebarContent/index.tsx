import {
  Button,
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
import { ChartContext } from "../../../../screens/ChartScreen";

const ChartSidebarContent: React.FC = () => {
  const { filterList, filters, setFilters } = useContext(FilterContext);
  const { fetchChartData } = useContext(ChartContext);

  const handleFilterSelect = (qId: string, value: string[]) => {
    const newFilters = [...filters];
    const filterSpliceIndices = [];

    for (let filterIndex = 0; filterIndex < filters.length; filterIndex++) {
      const filter = filters[filterIndex];
      if (filter.qId === qId) {
        const codeIndex = value.indexOf(filter.code);
        if (codeIndex < 0) {
          filterSpliceIndices.push(filterIndex);
        } else {
          value.splice(codeIndex, 1);
        }
      }
    }
    filterSpliceIndices.forEach((index) => {
      newFilters.splice(index, 1);
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
            <FormControl /* className={classes.formControl} */ variant="outlined" >
              <InputLabel id="demo-mutiple-checkbox-label">
                {filter.label}
              </InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                // label="Hello"
                // multiple
                value={filters
                  .filter((selectedFilter) => selectedFilter.qId === filter.qId)
                  .map((selectedFilter) => selectedFilter.code)}
                //   @ts-ignore
                onChange={(e: any, d) => {
                  handleFilterSelect(filter.qId, e.target.value);
                }}
                input={<Input />}
                renderValue={(selected) =>
                  filter.options
                    .filter((option) =>
                      // @ts-ignore
                      (selected as string[]).includes(option.labelCode)
                    )
                    .map((option) => option.labelText)
                    .join(", ")
                }
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
      <div>
        <Button className="button--primary" onClick={() => fetchChartData()}>
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ChartSidebarContent;

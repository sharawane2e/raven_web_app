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
import MultiSelect from "../../../widgets/MultiSelect";

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
            <FormControl
              /* className={classes.formControl} */ variant="outlined"
            >
              <InputLabel id={filter.qId}>{filter.label}</InputLabel>
              <Select
                labelId={filter.qId}
                id={filter.qId + "ques"}
                multiple
                label={filter.label}
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

        {filterList.map((filter, filterIndex) => (
          <MultiSelect
            key={filterIndex}
            label={filter.label}
            options={filter.options.map((option) => ({
              value: option.labelCode,
              label: option.labelText,
            }))}
            value={[]}
          />
        ))}
      </div>
      <div className="chart-sidebar__footer">
        <Button className="button--primary" onClick={() => fetchChartData()}>
          Apply
        </Button>
        <Button className="" onClick={() => {}}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ChartSidebarContent;

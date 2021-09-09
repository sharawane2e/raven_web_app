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
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChartData } from "../../../../redux/actions/chartActions";
import {
  fetchFilterList,
  resetAppliedFilters,
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../../../../redux/actions/filterActions";
import { RootState } from "../../../../redux/store";
import { fetchChartData } from "../../../../services/ChartService";
import { IQuestionOption } from "../../../../types/IQuestion";
import CustomScrollbar from "../../../CustomScrollbar";
import MultiSelect from "../../../widgets/MultiSelect";

const ChartSidebarContent: React.FC = () => {
  const dispatch = useDispatch();
  const { filterQuestionList, filters } = useSelector(
    (state: RootState) => state.filters
  );

  useEffect(() => {
    dispatch(fetchFilterList());
  }, []);

  const handleFilterSelect = (qId: string, values: IQuestionOption[]) => {
    const updatedFilters = [...filters];

    for (let index = 0; index < values.length; index++) {
      const filterValue = values[index];
      let filterExists: boolean = false;

      for (let filterIndex = 0; filterIndex < filters.length; filterIndex++) {
        const appliedFilter = filters[filterIndex];

        if (
          appliedFilter.qId === qId &&
          appliedFilter.code === filterValue.labelCode
        ) {
          filterExists = true;
        }
      }
      if (!filterExists) {
        updatedFilters.push({
          qId: qId,
          code: filterValue?.labelCode || "",
          label: filterValue?.labelText || "",
        });
      }
    }

    const updatedfilterQuestionList = filterQuestionList.map(
      (filterQuestion) => {
        if (filterQuestion.qId === qId) {
          return { ...filterQuestion, value: values };
        }
        return filterQuestion;
      }
    );
    dispatch(setFilterQuestionList(updatedfilterQuestionList));
    dispatch(setFilters(updatedFilters));
  };

  const applyFilters = () => {
    dispatch(setAppliedFilters(filters));
    fetchChartData()
      .then((chartData) => dispatch(setChartData(chartData)))
      .catch((error) => console.log(error));
  };

  return (
    <div className="chart-sidebar">
      <div className="chart-sidebar__filter-wrapper">
        <CustomScrollbar>
          <div className="chart-sidebar__filter-questions">
            {filterQuestionList.map((filterQuestion, filterIndex) => (
              <>
                <MultiSelect
                  label={filterQuestion.question.labelText}
                  options={filterQuestion.question.options.map((option) => ({
                    label: option.labelText,
                    value: option.labelCode,
                  }))}
                  value={filterQuestion.value}
                  onChange={(e) =>
                    handleFilterSelect(
                      filterQuestion.qId,
                      e.target.value as IQuestionOption[]
                    )
                  }
                />
                <Fragment key={filterIndex}>
                  <FormControl variant="outlined">
                    <InputLabel id={filterQuestion.qId}>
                      {filterQuestion.question.labelText}
                    </InputLabel>
                    <Select
                      labelId={filterQuestion.qId}
                      id={filterQuestion.qId + "ques"}
                      multiple
                      label={filterQuestion.question.labelText}
                      value={filterQuestion?.value || []}
                      onChange={(e: any, d) => {
                        handleFilterSelect(filterQuestion.qId, e.target.value);
                      }}
                      input={<Input />}
                      // @ts-ignore
                      renderValue={(selectedOptions: IQuestionOption[]) =>
                        selectedOptions.map(
                          (selectedOption) => selectedOption.labelText + ", "
                        )
                      }
                      // MenuProps={MenuProps}
                    >
                      {filterQuestion.question.options.map(
                        (option, optionIndex) => (
                          // @ts-ignore
                          <MenuItem key={optionIndex} value={option}>
                            <Checkbox
                              checked={filterQuestion?.value?.some(
                                (filterValue) =>
                                  filterValue.labelCode === option.labelCode
                              )}
                            />
                            <ListItemText primary={option.labelText} />
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Fragment>
              </>
            ))}
          </div>
        </CustomScrollbar>
      </div>
      <div className="chart-sidebar__footer">
        <Button className="button--primary" onClick={applyFilters}>
          Apply
        </Button>
        <Button
          className=""
          onClick={() => {
            dispatch(resetAppliedFilters());
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ChartSidebarContent;

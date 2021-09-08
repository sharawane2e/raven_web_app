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
import { Fragment, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFilterList,
  resetAppliedFilters,
  setAppliedFilters,
  setFilterQuestionList,
} from "../../../../redux/actions/filterActions";
import { RootState } from "../../../../redux/store";
import { ChartContext } from "../../../../screens/ChartScreen";
import { IQuestionOption } from "../../../../types/IQuestion";
import MultiSelect from "../../../widgets/MultiSelect";

const ChartSidebarContent: React.FC = () => {
  const dispatch = useDispatch();
  const { filterQuestionList, appliedFilters } = useSelector(
    (state: RootState) => state.filters
  );
  useEffect(() => {
    dispatch(fetchFilterList());
  }, []);

  const { fetchChartData } = useContext(ChartContext);

  const handleFilterSelect = (qId: string, values: IQuestionOption[]) => {
    const updatedAppliedFilters = [...appliedFilters];

    for (let index = 0; index < values.length; index++) {
      const filterValue = values[index];
      let filterExists: boolean = false;

      for (
        let filterIndex = 0;
        filterIndex < appliedFilters.length;
        filterIndex++
      ) {
        const appliedFilter = appliedFilters[filterIndex];

        if (
          appliedFilter.qId === qId &&
          appliedFilter.code === filterValue.labelCode
        ) {
          filterExists = true;
        }
      }
      if (!filterExists) {
        updatedAppliedFilters.push({
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
    dispatch(setAppliedFilters(updatedAppliedFilters));
  };

  return (
    <div className="chart-sidebar">
      <div className="chart-sidebar__filter-wrapper">
        {filterQuestionList.map((filterQuestion, filterIndex) => (
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
                {filterQuestion.question.options.map((option, optionIndex) => (
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
                ))}
              </Select>
            </FormControl>
          </Fragment>
        ))}
      </div>
      <div className="chart-sidebar__footer">
        <Button className="button--primary" onClick={() => fetchChartData()}>
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

import { Button } from "@material-ui/core";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChartData,
  setChartTranspose,
} from "../../../../redux/actions/chartActions";
import {
  fetchFilterList,
  resetFilters,
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../../../../redux/actions/filterActions";
import store, { RootState } from "../../../../redux/store";
import {
  fetchChartData,
  transposeChart,
} from "../../../../services/ChartService";
import { IQuestionOption } from "../../../../types/IBaseQuestion";
import CustomScrollbar from "../../../CustomScrollbar";
import MultiSelect from "../../../widgets/MultiSelect";

const ChartSidebarContent: React.FC = () => {
  const dispatch = useDispatch();
  const {
    filters: { filterQuestionList, filters },
    chart: { questionData },
  } = useSelector((state: RootState) => state);

  const handleFilterSelect = (qId: string, value: IQuestionOption) => {
    const updatedFilters = [...filters];

    const filterQuestion = filterQuestionList.find((q) => q.qId === qId);
    let values: IQuestionOption[] = filterQuestion?.value
      ? JSON.parse(JSON.stringify(filterQuestion?.value))
      : [];
    let index = -1;

    values.forEach((v, i) => {
      if (v.labelCode === value.labelCode) {
        index = i;
        const filterIndex = updatedFilters.findIndex(
          (filter) => filter.qId === qId && filter.code === v.labelCode
        );
        updatedFilters.splice(filterIndex, 1);
      }
    });
    if (index >= 0) {
      values.splice(index, 1);
    } else {
      values.push({ ...value });
    }

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
          questionLabel: filterQuestion?.labelText || "",
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
    const { chart } = store.getState();
    dispatch(setAppliedFilters(filters));
    if (chart.chartTranspose) {
      fetchChartData()
        .then((chartData) => {
          dispatch(setChartData(chartData));
          transposeChart();
          dispatch(setChartTranspose(chart.chartTranspose));
        })
        .catch((error) => console.log(error));
    } else {
      fetchChartData()
        .then((chartData) => {
          dispatch(setChartData(chartData));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="chart-sidebar">
      <div className="chart-sidebar__filter-wrapper">
        <CustomScrollbar>
          <div className="chart-sidebar__filter-questions Step-3">
            {filterQuestionList.map((filterQuestion, filterIndex) => (
              <MultiSelect
                key={filterIndex}
                label={filterQuestion.labelText}
                options={filterQuestion.options}
                value={filterQuestion.value}
                onChange={(value: IQuestionOption) => {
                  handleFilterSelect(filterQuestion.qId, value);
                }}
              />
            ))}
          </div>
        </CustomScrollbar>
      </div>
      <div className="chart-sidebar__footer">
        <Button
          className="button--primary Step-4"
          onClick={applyFilters}
          disabled={questionData === null}
        >
          Apply
        </Button>
        <Button
          className="clear-button"
          onClick={() => {
            dispatch(resetFilters());
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default memo(ChartSidebarContent);

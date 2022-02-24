import store, { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Chip, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import ClearIcon from "@material-ui/icons/Clear";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { IFilter } from "../../types/IFilter";
import CustomScrollbar from "../CustomScrollbar";
import { removeAppliedFilter } from "../../redux/actions/filterActions";
import { fetchChartData, transposeChart } from "../../services/ChartService";
import {
  setChartData,
  setChartTranspose,
} from "../../redux/actions/chartActions";
import { memo } from "react";

const AppliedFilterList: React.FC = () => {
  const { appliedFilters } = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch();

  const removeFilter = (filter: IFilter) => {
    const { chart } = store.getState();
    dispatch(removeAppliedFilter(filter));
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
    <div className="applied-filters">
      <div className="applied-filters--wrapper">
        <Chip
          label="Your selections"
          variant="outlined"
          className="applied-filters__info-chip"
        />
        {/* <Tooltip
            title={`Clear all Filters`}
            placement="top"
            arrow 
          >
            <HighlightOffIcon className="applied-filters--icon" onClick={handleRemoveFilters} />
          </Tooltip> */}
      </div>

      <div className="applied-filters__scroll-wrapper">
        <CustomScrollbar>
          <div className="applied-filters__filter-wrapper">
            {appliedFilters.length ? (
              appliedFilters.map((filter, index) => (
                <Tooltip
                  title={`${filter.questionLabel}: ${filter.label}`}
                  placement="top"
                  arrow
                >
                  <Chip
                    key={index}
                    variant="outlined"
                    onDelete={() => removeFilter(filter)}
                    label={filter.label}
                    deleteIcon={<CloseIcon />}
                    className="applied-filters__filter-chip"
                  />
                </Tooltip>
              ))
            ) : (
              <span className="no-selection-text">No filters applied</span>
            )}
          </div>
        </CustomScrollbar>
      </div>
    </div>
  );
};

export default memo(AppliedFilterList);

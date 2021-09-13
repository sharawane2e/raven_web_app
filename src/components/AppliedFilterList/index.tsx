import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Chip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { IFilter } from "../../types/IFilter";
import CustomScrollbar from "../CustomScrollbar";
import { removeAppliedFilter } from "../../redux/actions/filterActions";
import { fetchChartData } from "../../services/ChartService";
import { setChartData } from "../../redux/actions/chartActions";

const AppliedFilterList: React.FC = () => {
  const { appliedFilters } = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch();

  const removeFilter = (filter: IFilter) => {
    dispatch(removeAppliedFilter(filter));
    fetchChartData()
      .then((chartData) => {
        dispatch(setChartData(chartData));
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="applied-filters">
      <Chip
        label="Your selections"
        variant="outlined"
        className="applied-filters__info-chip"
      />

      <div className="applied-filters__scroll-wrapper">
        <CustomScrollbar>
          <div className="applied-filters__filter-wrapper">
            {appliedFilters.length ? (
              appliedFilters.map((filter, index) => (
                <Chip
                  key={index}
                  variant="outlined"
                  onDelete={() => removeFilter(filter)}
                  label={filter.label}
                  deleteIcon={<CloseIcon />}
                  className="applied-filters__filter-chip"
                />
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

export default AppliedFilterList;

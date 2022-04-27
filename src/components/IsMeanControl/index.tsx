import { Switch, Tooltip } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StaticText } from "../../constants/StaticText";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { ChartType } from "../../enums/ChartType";
import {
  setChartData,
  setChartLabel,
  setChartTranspose,
  setChartType,
  showMean,
  updateChartOptions,
} from "../../redux/actions/chartActions";
import store from "../../redux/store";
import { changeChartType, transposeChart } from "../../services/ChartService";
import { getChartOptions } from "../../utils/ChartOptionFormatter";

interface IsMeancontrolProps {}

const IsMeanControl: React.FC<IsMeancontrolProps> = () => {
  const { chart } = store.getState();
  const isChecked = chart.showMean;
  const dispatch = useDispatch();


  useEffect(() => {
    if (isChecked) {
     
      if (chart.chartTranspose) {
        transposeChart();
      }
      if (chart.chartLabelType === ChartLabelType.PERCENTAGE) {
        dispatch(setChartLabel(ChartLabelType.NUMBER));
      }
      
    } else {
    
      if(chart.chartType===ChartType.PIE){
        changeChartType(ChartType.COLUMN);
      }
    
    }
    
    const chartOptionsUpdate = getChartOptions();
    dispatch(updateChartOptions(chartOptionsUpdate));
  }, [isChecked,chart.chartType]);
  

  return (
    <div className="md-space-4 MuiFormControl-root">
      <span className="cell-value">
        <span className="static-switch-default">{StaticText?.DEFAULT}</span>

        <Tooltip
          title={`${isChecked ? StaticText?.MEAN_TOOTLE : StaticText?.DEFAULT}`}
          placement="bottom"
          arrow
        >
          <Switch
            checked={isChecked}
            // onChange={(e) => setIschecked(e.target.checked)}
            onChange={(e) => dispatch(showMean(e.target.checked))}
            disabled={false}
          />
        </Tooltip>

        <span
          className={`${
            isChecked ? "static-switch-mean bold-text" : "static-switch-mean"
          }`}
        >
          {StaticText?.MEAN_TOOTLE}
        </span>
      </span>
    </div>
  );
};

export default IsMeanControl;
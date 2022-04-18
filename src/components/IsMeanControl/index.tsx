import { Switch, Tooltip } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StaticText } from '../../constants/StaticText';
import { ChartLabelType } from '../../enums/ChartLabelType';
import {
  setChartData,
  setChartLabel,
  setChartTranspose,
  showMean,
  updateChartOptions,
} from '../../redux/actions/chartActions';
import store from '../../redux/store';
import { getChartOptions } from '../../utils/ChartOptionFormatter';

interface IsMeancontrolProps {}

const IsMeanControl: React.FC<IsMeancontrolProps> = () => {

  
  const [isChecked, setIschecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (isChecked) {
      dispatch(setChartLabel(ChartLabelType.NUMBER));
      dispatch(showMean(true));
    } else {
      dispatch(setChartLabel(ChartLabelType.PERCENTAGE));
      dispatch(showMean(false));
    }

    const chartOptionsUpdate = getChartOptions();

    const{chart:{
      chartOptions
    }} = store.getState();

    const updatedChartOptions = {
      ...chartOptions,
      ...chartOptionsUpdate
    }
    dispatch(updateChartOptions(updatedChartOptions))
  },[isChecked])

 
  return (
    <div className="md-space-4 MuiFormControl-root">
      <span className="cell-value">
        <span className="static-switch-default">
          {StaticText?.DEFAULT}
        </span>

        <Tooltip
          title={`${
            isChecked ? StaticText?.MEAN_TOOTLE : StaticText?.DEFAULT
          }`}
          placement="bottom"
          arrow
        >
          <Switch
            checked={isChecked}
            onChange={(e) => setIschecked(e.target.checked)}
            disabled={false}
          />
        </Tooltip>

        <span
          className={`${
            isChecked ? 'static-switch-mean bold-text' : 'static-switch-mean'
          }`}
        >
          {StaticText?.MEAN_TOOTLE}
        </span>
      </span>
    </div>
  );
};

export default IsMeanControl;

import { Switch, Tooltip } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { StaticText } from '../../constants/StaticText';
import { ChartLabelType } from '../../enums/ChartLabelType';
import {
  setChartLabel,
  setChartTranspose,
  transposehideshow,
} from '../../redux/actions/chartActions';

interface IsMeancontrolProps {}

const IsMeancontrol: React.FC<IsMeancontrolProps> = () => {
  const [ischecked, setischecked] = useState(false);
  const dispatch = useDispatch();
  const handleActivateClick = (event: any) => {
    const ischeckTrue = event.target.checked;
    setischecked(ischeckTrue);
    if (ischeckTrue) {
      dispatch(setChartLabel(ChartLabelType.NUMBER));
      dispatch(transposehideshow(true));
    } else {
      dispatch(setChartLabel(ChartLabelType.PERCENTAGE));
      dispatch(transposehideshow(false));
    }
  };
  return (
    <div className="md-space-4 MuiFormControl-root">
      <span className="cell-value">
        <span className="static-switch-default">
          {StaticText?.DEFAULT_TOOTLE}
        </span>

        <Tooltip
          title={`${
            ischecked ? StaticText?.MEAN_TOOTLE : StaticText?.DEFAULT_TOOTLE
          }`}
          placement="bottom"
          arrow
        >
          <Switch
            checked={ischecked}
            onChange={(e) => handleActivateClick(e)}
            disabled={false}
          />
        </Tooltip>

        <span
          className={`${
            ischecked ? 'static-switch-mean bold-text' : 'static-switch-mean'
          }`}
        >
          {StaticText?.MEAN_TOOTLE}
        </span>
      </span>
    </div>
  );
};

export default IsMeancontrol;

import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as PortraitIcon } from '../../assets/svg/portrait-icon.svg';
import { ReactComponent as LandscapeIcon } from '../../assets/svg/landscape-icon.svg';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  changeChartType,
  transposeChart,
  transposeChartMulti,
} from '../../services/ChartService';
import { QuestionType } from '../../enums/QuestionType';
import { ReactComponent as TransposeIcon } from '../../assets/svg/Transpose.svg';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';
import store from '../../redux/store';

interface IsMeancontrolProps {}

const IsMeancontrol: React.FC<IsMeancontrolProps> = () => {
  return (
    <div className="md-space-4 MuiFormControl-root">
      Is Mean update with data
    </div>
  );
};

export default IsMeancontrol;

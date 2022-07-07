import { useDispatch, useSelector } from 'react-redux';
import { ChartType } from '../../enums/ChartType';
import store, { RootState } from '../../redux/store';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as SignificantDiffIcon } from '../../assets/svg/signf-d.svg';
import { QuestionType } from '../../enums/QuestionType';
import { changeChartType } from '../../services/ChartService';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';
import {
  updateChartOptions,
  updateSignificant,
} from '../../redux/actions/chartActions';
import { useEffect } from 'react';
import { getChartOptions } from '../../utils/ChartOptionFormatter';

interface ChartTypeControlProps {}

const SignificantDiff: React.FC<ChartTypeControlProps> = () => {
  const dispatch = useDispatch();
  const {
    chart,
    questions: { selectedBannerQuestionId },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    const chartOptionsUpdate = getChartOptions();
    dispatch(updateChartOptions(chartOptionsUpdate));
  }, [chart.significant]);

  const significantDisabled = () => {
    let isPieDisabled = true;
    if (
      chart.questionData?.type === QuestionType.SINGLE &&
      selectedBannerQuestionId
    ) {
      isPieDisabled = false;
    } else if (
      chart.questionData?.type === QuestionType?.MULTI &&
      selectedBannerQuestionId
    ) {
      isPieDisabled = false;
    } else if (chart.questionData?.type === QuestionType?.RANK) {
      isPieDisabled = true;
    } else if (chart.questionData === null) {
      isPieDisabled = true;
    } else if (chart.questionData?.type === QuestionType?.GRID) {
      isPieDisabled = false;
    } else if (chart.showMean) {
      console.log('chart.showMean', chart.showMean);
      isPieDisabled = true;
    }
    return isPieDisabled;
  };

  const handleClick = () => {
    dispatch(updateSignificant(!chart.significant));
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: 'Significant Difference',
      renderChild: () => <SignificantDiffIcon />,
      onClick: handleClick,
      active: chart.significant,
      disabled: chart.showMean ? true : significantDisabled(),
      disableClick: () => Toaster.error(StaticText.SIGNIFICANT_DIFFERENCE),
    },
  ];

  return (
    <ButtonGroup
      groupTitle=""
      buttonConfig={buttonConfig}
      className="signDiff chartTyle__option"
    />
  );
};

export default SignificantDiff;

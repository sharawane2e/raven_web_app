import { useSelector } from 'react-redux';
import { ChartType } from '../../enums/ChartType';
import { RootState } from '../../redux/store';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as SignificantDiffIcon } from '../../assets/svg/signf-d.svg';
import { QuestionType } from '../../enums/QuestionType';
import { changeChartType } from '../../services/ChartService';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';

interface ChartTypeControlProps {}

const SignificantDiff: React.FC<ChartTypeControlProps> = () => {
  const {
    chart,
    questions: { selectedBannerQuestionId },
  } = useSelector((state: RootState) => state);
  const { chartType } = chart;

  const handlePieDisabled = () => {
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
    }

    return isPieDisabled;
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: 'Significant Difference',
      renderChild: () => <SignificantDiffIcon />,
      onClick: () => changeChartType(ChartType.COLUMN),
      active: chartType === ChartType.COLUMN,
      disabled: handlePieDisabled(),
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

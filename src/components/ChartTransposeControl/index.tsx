import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { transposeChart } from '../../services/ChartService';
import { QuestionType } from '../../enums/QuestionType';
import { ReactComponent as TransposeIcon } from '../../assets/svg/Transpose.svg';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';
import store from '../../redux/store';

interface ChartTransposeControlProps {}

const ChartTransposeControl: React.FC<ChartTransposeControlProps> = () => {
  const {
    chart: { chartTranspose, questionData, bannerQuestionData, showMean },
  } = store.getState();

  const disabledOption = () => {
    return (
      (questionData?.type === QuestionType.SINGLE && !bannerQuestionData) ||
      (questionData?.type === QuestionType.MULTI && !bannerQuestionData) ||
      questionData === null ||
      (questionData?.type === QuestionType?.NUMBER && !bannerQuestionData)
    );
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: 'Transpose',
      renderChild: () => <TransposeIcon />,
      onClick: transposeChart,
      active: chartTranspose,
      disabled: disabledOption(),
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART_TRANS),
    },
  ];

  return (
    <ButtonGroup
      groupTitle=""
      buttonConfig={buttonConfig}
      className="transpose"
    />
  );
};

export default ChartTransposeControl;

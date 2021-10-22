import { useDispatch, useSelector } from "react-redux";
import { ChartType } from "../../enums/ChartType";
import { AppDispatch, RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import "svg2pdf.js";
import { generateChart } from "../../utils/PptDataGenerator";
import { generatePdf } from "../../utils/PdfDataGenerator";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const {
    chart,
    questions: { selectedBannerQuestionId },
  } = useSelector((state: RootState) => state);
  const { chartType } = chart;
  const buttonConfig: ButtonGroupConfig[] = [
    {
      renderChild: () => <PptIcon />,
      onClick: generateChart,
      // disabled: true,
      active: chartType === ChartType.TABLE,
      disabled: chart.questionData === null,
    },
    {
      renderChild: () => <PdfIcon />,
      onClick: generatePdf,
      // disabled: true,
      active: chartType === ChartType.TABLE,
      disabled: chart.questionData === null,
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Export"
      buttonConfig={buttonConfig}
      className="export-chart-group"
    />
  );
};

export default ExportChart;

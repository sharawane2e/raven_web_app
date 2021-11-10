import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import "svg2pdf.js";
import { generateChart } from "../../utils/PptDataGenerator";
import { generatePdf } from "../../utils/PdfDataGenerator";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const { chart } = useSelector((state: RootState) => state);

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Powerpoint",
      renderChild: () => <PptIcon />,
      onClick: generateChart,
      // disabled: true,
      disabled: chart.questionData === null,
    },
    {
      tooltip: "PDF",
      renderChild: () => <PdfIcon />,
      onClick: generatePdf,
      // disabled: t,
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

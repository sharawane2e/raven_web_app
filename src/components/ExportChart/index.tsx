import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import "svg2pdf.js";
import { generateChart } from "../../utils/PptDataGenerator";
import { generatePdf } from "../../utils/PdfDataGenerator";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const buttonConfig: ButtonGroupConfig[] = [
    {
      renderChild: () => <PptIcon />,
      onClick: generateChart,
      // disabled: true,
    },
    {
      renderChild: () => <PdfIcon />,
      onClick: generatePdf,
      // disabled: true,
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

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as PdfIcon } from '../../assets/svg/pdf-icon.svg';
import { ReactComponent as PptIcon } from '../../assets/svg/ppt-icon.svg';
import 'svg2pdf.js';
import { generatePpt } from '../../utils/ppt/PptGen';
import { generatePdf } from '../../utils/pdf/PdfGen';
import {} from '../../utils/ppt/PptGen';
import store from "../../redux/store";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const { chart } = useSelector((state: RootState) => state);

  const generatePptPayload = ()=>{

    const {
      chart,
      filters,
    } = store.getState();

    const payloadObject = {
      chart,
      filters,
    }

    generatePpt([payloadObject])

  }
  const generatePdfPayload = ()=>{

    const {
      chart,
      filters,
    } = store.getState();

    const payloadObject = {
      chart,
      filters,
    }

    generatePdf([payloadObject])

  }

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: 'Powerpoint',
      renderChild: () => <PptIcon />,
      onClick: generatePptPayload,
      disabled: chart.questionData === null,
    },
    {
      tooltip: 'PDF',
      renderChild: () => <PdfIcon />,
      onClick: generatePdfPayload,
      disabled: chart.questionData === null,
    },
  ];

  return (
    <ButtonGroup
      groupTitle=""
      buttonConfig={buttonConfig}
      className="export-chart-group"
    />
  );
};

export default ExportChart;

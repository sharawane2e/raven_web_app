import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import { ReactComponent as Wishlist } from "../../assets/svg/wishlist.svg";
import "svg2pdf.js";
import { generatePpt } from "../../utils/ppt/PptGen";
import { generatePdf } from "../../utils/pdf/PdfGen";
import ApiUrl from "../../enums/ApiUrl";
import ApiRequest from "../../utils/ApiRequest";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const { questions } = useSelector((state: RootState) => state);
  const questionText = questions.questionList;

  const userCache = () => {
    let data;
    ApiRequest.request(ApiUrl.SAVECHART, "POST", data)
      .then((res) => {
        if (res.success) {
          console.log("data send ");
        } else {
          // Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => console.log("finaly run"));
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "User Cache",
      renderChild: () => <Wishlist />,
      onClick: userCache,
      //active: true,
      // disabled: t,
      disabled: chart.questionData === null,
    },
    {
      tooltip: "Powerpoint",
      renderChild: () => <PptIcon />,
      onClick: generatePpt,
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
      // groupTitle="Export"
      groupTitle=""
      buttonConfig={buttonConfig}
      className="export-chart-group"
    />
  );
};

export default ExportChart;

import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import pptxgen from "pptxgenjs";
import {
  singleChartDataGen,
  gridChartDataGen,
  tableChartDataGen,
} from "../../utils/PptDataGenerator";
import { QuestionType } from "../../enums/QuestionType";
import { ISlideConfig } from "../../types/ISlideConfig";
import { colorArr, primaryBarColor } from "../../constants/Variables";
import * as path from "path";

interface ExportChartProps {}

const setDefaultSlideProperties = (
  slide: any,
  pptxGenJsObj: any,
  config: ISlideConfig
) => {
  const { mainQuestionText, chartFontFace, baseText, questionText } = config;

  slide.addShape(pptxGenJsObj.ShapeType.rect, {
    x: 0.5,
    y: 0,
    w: 0.1,
    h: 0.5,
    fill: { color: primaryBarColor },
    line: { type: "none" },
  });
  slide.addText(mainQuestionText, {
    x: 1,
    y: 0.25,
    w: 8,
    fontFace: chartFontFace,
    fontSize: 10,
    color: "000000",
    align: "left",
  });
  slide.addText(baseText, {
    x: 0.5,
    y: 4.9,
    w: 9.5,
    fontFace: chartFontFace,
    fontSize: 8,
    color: "000000",
    align: "left",
    bold: true,
  });
  slide.addText(questionText, {
    x: 0.5,
    y: 5.1,
    w: 9.5,
    fontFace: chartFontFace,
    fontSize: 8,
    color: "000000",
    align: "left",
  });

  slide.addText("© 2020, HFS Research Ltd", {
    x: 4.2,
    y: 5.4,
    w: 1.5,
    fontFace: chartFontFace,
    fontSize: 8,
    color: "666666",
    align: "center",
  });

  // "/src/assets/svg/brand-logo.jpg"
  // console.log(__dirname);
  // slide.addImage({
  //   path: path.join(__dirname, "../../assets/svg/brand-logo.svg"),

  //   x: 0,
  //   y: 5.2,
  //   w: 1,
  //   h: 0.4,
  // });
};

const ExportChart: React.FC<ExportChartProps> = () => {
  const {
    chart: { chartData, questionData, baseCount },
  } = useSelector((state: RootState) => state);

  const generateChart = async () => {
    let pptxGenJsObj = new pptxgen();
    let fileName: string = "HFS- " + questionData?.labelText;
    let mainQuestionText: string = questionData?.labelText || "";
    let baseText: string = `Base: Total = ${baseCount}`;
    let questionText: string = questionData?.questionText || "";
    let chartFontFace: string = "Calibri";
    let vericalColumnSlide = pptxGenJsObj.addSlide();
    // let vericalStackedSlide = pptxGenJsObj.addSlide();
    let horizontalColumnSlide = pptxGenJsObj.addSlide();
    // let horizontalStackedSlide = pptxGenJsObj.addSlide();
    let tableSlide = pptxGenJsObj.addSlide();

    let slideConfig: ISlideConfig = {
      mainQuestionText,
      baseText,
      questionText,
      chartFontFace,
    };
    let seriesData: any[] = [];

    if (
      questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.RANK ||
      questionData?.type === QuestionType.MULTI
    ) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI
    ) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    } else {
      console.log("under development");
    }

    let colors;
    if (seriesData.length > 1) {
      colors = [...colorArr];
    } else {
      colors = [primaryBarColor];
    }

    const commonChartProperties = {
      x: 0.3,
      y: 0.5,
      w: 9.4,
      h: 4.2,
      chartColors: colors,
      dataLabelFontFace: chartFontFace,
      dataLabelFontSize: 4,
      dataLabelFontBold: true,
      showValue: true,
      catAxisLabelColor: "666666",
      catAxisLabelFontFace: chartFontFace,
      catAxisLabelFontSize: 6,
      valAxisLabelFontSize: 6,
      valAxisLabelColor: "666666",
      valAxisLabelFontFace: chartFontFace,
      legendFontSize: 6,
      showLegend: true,
      showTitle: false,
      dataLabelFormatCode: "0%;;;,##.##%",
      dataLabelColor: "000000",
    };

    setDefaultSlideProperties(vericalColumnSlide, pptxGenJsObj, slideConfig);
    setDefaultSlideProperties(horizontalColumnSlide, pptxGenJsObj, slideConfig);
    // setDefaultSlideProperties(vericalStackedSlide, pptxGenJsObj, slideConfig);
    // setDefaultSlideProperties(
    //   horizontalStackedSlide,
    //   pptxGenJsObj,
    //   slideConfig
    // );
    setDefaultSlideProperties(tableSlide, pptxGenJsObj, slideConfig);

    vericalColumnSlide.addChart(
      pptxGenJsObj.ChartType.bar,
      seriesData,

      {
        ...commonChartProperties,
        dataLabelColor: "000000",
        barDir: "col",
        barGrouping: "clustered",
        legendPos: "b",
        dataBorder: { pt: 1, color: "0000ffff" },
      }
    );

    horizontalColumnSlide.addChart(pptxGenJsObj.ChartType.bar, seriesData, {
      ...commonChartProperties,
      legendPos: "b",
      dataLabelColor: "FFFFFF",
      barDir: "bar",
      barGrouping: "percentStacked",
    });

    const row = tableChartDataGen(seriesData);

    tableSlide.addTable(row, {
      x: 0.3,
      y: 0.6,
      h: 3,
      w: 9.4,
      border: { type: "solid" },
      fontSize: 6,
    });

    await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      renderChild: () => <PptIcon />,
      onClick: generateChart,
    },
    {
      renderChild: () => <PdfIcon />,
      disabled: true,
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

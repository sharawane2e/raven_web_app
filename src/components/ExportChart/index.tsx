import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import pptxgen from "pptxgenjs";
import { decimalPrecision } from "../../constants/Variables";
import { QuestionType } from "../../enums/QuestionType";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const {
    chart: { chartData, questionData, baseCount },
  } = useSelector((state: RootState) => state);

  let lb: any = [];
  let val: any = [];
  let labels: any = [];
  const generateChart = async () => {
    let seriesData: any[] = [];
    // console.log(chartData);
    // console.log(questionData);
    if (questionData?.type === "S" || questionData?.type === "R") {
      let options = questionData?.options || [];
      let sortedOptions = options.map((i) => {
        return parseInt(i.labelCode, 10);
      });

      sortedOptions.map((item) => {
        let cLb = options.find(
          (element) => element.labelCode == item.toString()
        );

        lb.push(cLb?.labelText);
      });

      let ChartDataCodeToInt = chartData.map((i) => {
        let code = parseInt(i.labelCode);
        let count = i.count;

        return { code, count };
      });
      const sortedCountObj = ChartDataCodeToInt.sort((first, second) =>
        first.code > second.code ? 1 : -1
      );

      sortedCountObj.map((i) => {
        val.push(i.count);
      });
      seriesData = [
        {
          name: questionData?.labelText,
          labels: lb,
          values: val,
        },
      ];
    } else if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI
    ) {
      labels = questionData.subGroups.map((subGroup) => subGroup.labelText);

      questionData.scale.forEach((scaleOption) => {
        seriesData.push({
          name: scaleOption.labelText,
          labels,
          values: questionData.subGroups.map((subGroup: any) => {
            const subGroupData = chartData.find(
              (data) => data._id === subGroup.qId
            );
            if (subGroupData) {
              const data = subGroupData?.options?.find(
                (scaleData: any) => scaleData.option === scaleOption.labelCode
              )?.count;
              return data !== undefined
                ? +((data / baseCount) * 100).toFixed(decimalPrecision)
                : 0;
            } else {
              return 0;
            }
          }),
        });
      });
    } else if (questionData?.type === "M") {
      console.log("multi question");
    }

    let fileName,
      mainQuestionText,
      baseText,
      questionText,
      tableHeading: string;

    let VChartType, VChartGroupingType, HChartType, HChartGroupingType: any;
    let pptxGenJsObj = new pptxgen();

    fileName = "HFS- " + questionData?.labelText;
    mainQuestionText = questionData?.labelText || "";
    baseText =
      "Base: Total = 100 Filters: Gender (M) / Age (20 -30,30 – 40) / Region (USA)";
    questionText = questionData?.questionText || "";

    VChartType = "col";
    VChartGroupingType = "clustered	";
    tableHeading = "Chart Data";
    HChartType = "bar";
    HChartGroupingType = "percentStacked";

    //slides
    let vericalChartSlide = pptxGenJsObj.addSlide();
    let horizontalChartSlide = pptxGenJsObj.addSlide();
    let tableSlide = pptxGenJsObj.addSlide();

    let colors;
    if (seriesData.length > 1) {
      colors = [
        "#CC6933",
        "#E37439",
        "#F47C3C",
        "#323C4E",
        "#566fa3",
        "#ECECEC",
        "#93B0E6",
        "#849ECF",
        "#67ABE6",
        "#989A9B",
        "#A3ABAE",
        "#47769E",
        "#CCCCCC",
        "#B9B9B9",
        "#7A94B0",
      ];
    } else {
      colors = ["#F47C3C"];
    }
    const commonChartProperties = {
      x: 0,
      y: 0.9,
      w: 10,
      h: 3.6,
      chartColors: colors,
      dataLabelFontFace: "Arial",
      dataLabelFontSize: 8,
      dataLabelFontBold: true,
      showValue: true,
      catAxisLabelColor: "000000",
      catAxisLabelFontFace: "Courier",
      catAxisLabelFontSize: 12,
      // catAxisOrientation: "minMax",
      showLegend: true,
      showTitle: false,
      dataLabelFormatCode: "0%;;;,##.## %",
    };

    let verticalBarChartConfiguration = {
      dataLabelColor: "000000",
      ...commonChartProperties,
      barDir: VChartType.toLowerCase(),
      barGrouping: VChartGroupingType,
    };

    let horizontalBarChartConfiguration = {
      dataLabelColor: "FFFFFF",
      ...commonChartProperties,
      barDir: HChartType,
      barGrouping: HChartGroupingType,
    };
    vericalChartSlide.addShape(pptxGenJsObj.ShapeType.rect, {
      x: 0.5,
      y: 0,
      w: 0.1,
      h: 0.8,
      fill: { color: "F47C3C" },
      line: { type: "none" },
    });
    vericalChartSlide.addText(mainQuestionText, {
      x: 1,
      y: 0.4,
      w: 8,
      fontFace: "Calibri",
      fontSize: 16,
      color: "000000",
      align: "left",
    });
    vericalChartSlide.addText(baseText, {
      x: 0,
      y: 4.6,
      w: 10,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "left",
      bold: true,
    });
    vericalChartSlide.addText(questionText, {
      x: 0,
      y: 4.8,
      w: 10,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "left",
    });

    vericalChartSlide.addText("© 2020, HFS Research Ltd", {
      x: 4.2,
      y: 5.2,
      w: 1.5,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "center",
    });

    // add image path and set x and y cords according to it
    // vericalChartSlide.addImage({
    //   path: 'https://cdn1.expresscomputer.in/wp-content/uploads/2018/10/17211510/HFS.jpg',
    //   x: 0,
    //   y: 5.2,
    //   w: 1,
    // });
    vericalChartSlide.addText("HFS Research", {
      x: 0,
      y: 5.2,
      w: 1,
      fontFace: "Calibri",
      fontSize: 8,
      color: "F47C3C",
      align: "left",
    });

    vericalChartSlide.addText("Page 1", {
      x: 9,
      y: 5.2,
      w: 1,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "right",
    });

    //htext
    horizontalChartSlide.addShape(pptxGenJsObj.ShapeType.rect, {
      x: 0.5,
      y: 0,
      w: 0.1,
      h: 0.8,
      fill: { color: "F47C3C" },
      line: { type: "none" },
    });
    horizontalChartSlide.addText(mainQuestionText, {
      x: 1,
      y: 0.4,
      w: 8,
      fontFace: "Calibri",
      fontSize: 16,
      color: "000000",
      align: "left",
    });
    horizontalChartSlide.addText(baseText, {
      x: 0,
      y: 4.6,
      w: 10,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "left",
      bold: true,
    });
    horizontalChartSlide.addText(questionText, {
      x: 0,
      y: 4.8,
      w: 10,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "left",
    });

    horizontalChartSlide.addText("© 2020, HFS Research Ltd", {
      x: 4.2,
      y: 5.2,
      w: 1.5,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "center",
    });

    // add image path and set x and y cords according to it
    // horizontalChartSlide.addImage({
    //   path: 'https://cdn1.expresscomputer.in/wp-content/uploads/2018/10/17211510/HFS.jpg',
    //   x: 0,
    //   y: 5.2,
    //   w: 1,
    // });
    horizontalChartSlide.addText("HFS Research", {
      x: 0,
      y: 5.2,
      w: 1,
      fontFace: "Calibri",
      fontSize: 8,
      color: "F47C3C",
      align: "left",
    });
    horizontalChartSlide.addText("Page 2", {
      x: 9,
      y: 5.2,
      w: 1,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "right",
    });

    //table slide

    tableSlide.addText(tableHeading, {
      x: 0.5,
      y: 0.4,
      w: 8,
      fontFace: "Calibri",
      fontSize: 16,
      color: "000000",
      align: "center",
    });

    tableSlide.addText("© 2020, HFS Research Ltd", {
      x: 4.2,
      y: 5.2,
      w: 1.5,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "center",
    });

    tableSlide.addText("HFS Research", {
      x: 0,
      y: 5.2,
      w: 1,
      fontFace: "Calibri",
      fontSize: 8,
      color: "F47C3C",
      align: "left",
    });
    tableSlide.addText("Page 3", {
      x: 9,
      y: 5.2,
      w: 1,
      fontFace: "Calibri",
      fontSize: 8,
      color: "000000",
      align: "right",
    });

    vericalChartSlide.addChart(
      pptxGenJsObj.ChartType.bar,
      seriesData,
      verticalBarChartConfiguration
    );

    horizontalChartSlide.addChart(
      pptxGenJsObj.ChartType.bar,
      seriesData,
      horizontalBarChartConfiguration
    );

    let row = [];
    row.push(["", ...seriesData[0].labels]);
    for (let i = 0; i < seriesData.length; i++) {
      row.push([seriesData[i].name, ...seriesData[i].values]);
    }

    tableSlide.addShape(pptxGenJsObj.ShapeType.rect, {
      x: 0.5,
      y: 0,
      w: 0.1,
      h: 0.8,
      fill: { color: "F47C3C" },
      line: { type: "none" },
    });
    // @ts-ignore
    tableSlide.addTable(row, {
      x: 0.5,
      y: 1,
      h: 3,
      w: 9,
      border: { type: "solid" },
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

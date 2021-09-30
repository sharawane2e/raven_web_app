import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import pptxgen from "pptxgenjs";
interface ExportChartProps {}

const ExportChart: React.FC<ExportChartProps> = () => {
  const {
    chart: { chartData, questionData },
  } = useSelector((state: RootState) => state);

  let lb: any = [];
  let val: any = [];
  let labels: any = [];
  const generateChart = async () => {
    let ChartData: any = [];
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
      ChartData = [
        {
          name: questionData?.labelText,
          labels: lb,
          values: val,
        },
      ];
    } else if (questionData?.type === "G") {
      // console.log("chart data ", chartData);
      // console.log("question data ", questionData);
      // let lbs: any = [];
      // questionData.subGroups.map((subQuestion) => {
      //   lbs.push(subQuestion.labelText);
      // });

      // chartData.map((subQuestionCount) => {
      //   // const name = subQuestionCount.labelText;
      //   let labels: any = [];
      //   let values: any = [];

      //   let name;
      //   for (let i = 0; i < subQuestionCount.options.length; i++) {
      //     name = subQuestionCount._id;

      //     labels.push(subQuestionCount.options[i].option);
      //     values.push(subQuestionCount.options[i].count);
      //   }
      //   ChartData.push({
      //     name,
      //     labels,
      //     values,
      //   });
      // });

      let lbs: any = [];
      for (let index = 0; index < questionData.subGroups.length; index++) {
        lbs.push(questionData.subGroups[index].labelText);
      }
      // console.log("labels", lbs);
      let names: any = [];
      let nameCodes: any = [];
      for (let index = 0; index < questionData.scale.length; index++) {
        names.push(questionData.scale[index].labelText);
        nameCodes.push(questionData.scale[index].labelCode);
      }
      // console.log("codes:", nameCodes.sort());
      // console.log("scales", names);

      let questionOptionDataGroup: any = [];
      for (let index = 0; index < chartData.length; index++) {
        // console.log(index, chartData[index].options);
        for (
          let index2 = 0;
          index2 < chartData[index].options.length;
          index2++
        ) {
          questionOptionDataGroup.push(chartData[index].options[index2]);
        }
      }

      // console.log("semi data ", questionOptionDataGroup);
      let finalData: any;
      let groupBy = (array: any, key: any) => {
        return array.reduce((result: any, obj: any) => {
          (result[obj[key]] = result[obj[key]] || []).push(obj);

          return result;
        }, {});
      };

      finalData = groupBy(questionOptionDataGroup, "option");

      let final: any = [];
      let keys = Object.keys(finalData).length;
      console.log("key length:", keys);
      console.log("finalData:", finalData);
      names.map((n: any) => {
        let vals: any = [];

        let x: any[];
        let cnts: any;
        cnts = [];
        for (let index = 1; index <= keys; index++) {
          cnts = [];
          console.log(finalData[index]);
          let keys2 = Object.keys(finalData[index]);
          console.log("keys2: ", keys2.length);
          for (let j = 0; j < keys2.length; j++) {
            console.log(finalData[index][j].count);
            cnts.push(finalData[index][j].count);
          }
          console.log("cunts", cnts);
        }
        final.push({
          name: n,
          labels: lbs,
          values: cnts,
        });
        cnts = [];
      });

      ChartData = final;
      console.log("chart data", ChartData);
      console.log("amogh this is final :", final);

      // labels = [
      //   "Jan",
      //   "Feb",
      //   "Mar",
      //   "Apr",
      //   "May",
      //   "Jun",
      //   "Jul",
      //   "Aug",
      //   "Sep",
      //   "Oct",
      //   "Nov",
      //   "Dec",
      // ];
      // ChartData = [
      //   {
      //     name: "Tokyo",
      //     labels,
      //     values: [
      //       49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
      //       95.6, 54.4,
      //     ],
      //   },
      //   {
      //     name: "New York",
      //     labels,
      //     values: [
      //       83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5,
      //       106.6, 92.3,
      //     ],
      //   },
      //   {
      //     name: "London",
      //     labels,
      //     values: [
      //       48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
      //       51.2,
      //     ],
      //   },
      //   {
      //     name: "Berlin",
      //     labels,
      //     values: [
      //       42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8,
      //       51.1,
      //     ],
      //   },
      // ];
      // console.log("under development ");
    } else if (questionData?.type === "M") {
      console.log("multi question");
    }
    // console.log("outside final data");
    // console.log(ChartData);

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
    if (ChartData.length > 1) {
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
      ChartData,
      verticalBarChartConfiguration
    );

    horizontalChartSlide.addChart(
      pptxGenJsObj.ChartType.bar,
      ChartData,
      horizontalBarChartConfiguration
    );

    let row = [];
    row.push(["", ...ChartData[0].labels]);
    for (let i = 0; i < ChartData.length; i++) {
      row.push([ChartData[i].name, ...ChartData[i].values]);
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

    // await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
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

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import jsPDF from "jspdf";
import { setDefaultPdfPageProperties } from "../../utils/pdf/DefaultPdfProps";
import store from "../../redux/store";
import { ChartType } from "../../enums/ChartType";
import { getChartRows } from "../../utils/table-option-util";
import { PdfGenExport } from "../../utils/pdf/PdfGenExport";
import autoTable from "jspdf-autotable";
import { projectName } from "../../constants/Variables";
import { getPlotOptions } from "../../utils/ChartOptionFormatter";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { fillEmptyDateSeries } from "../../utils/chart-option-util/significanceDiff";

const ExportPdfCharts = () => {
  const {
    export: { pdfExport },
  } = store.getState();

  let obj: any;
  let chartsArray: any = [];

  obj = {
    chartOptions: {
      title: {
        text: "",
      },
      chart: {
        renderTo: "container",
        type: "column",
        style: {
          fontFamily: '"Avenir", Arial',
          fontSize: "15px",
        },
        //margin: [70, 0, 280, 0],
        padding: [20, 20, 20, 20],
        height: "900px",
      },
      legend: {
        enabled: true,
        // itemWidth: 150,
        reversed: false,
        itemStyle: {
          color: "#666666",
          fontWeight: "normal",
          fontSize: "14px",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          "<span>{point.name}</span>: Count<b> {point.numberValue}, {point.percentageValue:.2f}%</b> of total <b>{point.baseCount}</b><br/>",
      },
      xAxis: {
        type: "category",
        labels: {
          style: {
            fontFamily: '"Avenir", Arial',
            fontSize: "15px",
          },
        },
      },
      yAxis: {
        visible: false,
        reversedStacks: false,
        labels: {
          style: {
            fontFamily: '"Avenir", Arial',
            fontSize: "15px",
          },
        },
      },
      plotOptions: {
        series: {
          pointPadding: 0.04,
          groupPadding: 0.05,
          borderWidth: 0,
          shadow: false,
          dataLabels: {
            enabled: true,

            overflow: "none",
            // enabled: true,
            formatter: function (this: any, options: any) {
              return ` ${parseFloat(this.y.toFixed(2))}${
                ChartLabelType.PERCENTAGE ? "%" : ""
              } <span class="significante-color">${
                this.point.significantDiffernce
                  ? this.point.significantDiffernce
                  : ""
              } </span>`;
            },
            allowOverlap: true,
            rotation: -90,
            align: "top",
            x: 0,
            y: -6,
            crop: false,
            style: {
              fontSize: "8px",
              textOutline: false,
              fontWeight: "normal",
              width: "100%",
            },
          },
        },
      },
      series: [],
    },
  };

  pdfExport.forEach((pdfel: any) => {
    const dataObject = changeChartType(
      obj,
      pdfel?.payloadData?.chart?.chartType,
      pdfel?.payloadData?.chart
    );
    let newObj = { ...dataObject.chartOptions };
    newObj.series = [];

    newObj?.series.push(...pdfel.seriesData);
    chartsArray.push(newObj);
  });

  return (
    <>
      <div className="allpdfhighcharts">
        {/* <button onClick={() => print()}>Print</button> */}
        {chartsArray?.map((chart: any, Index: number) => (
          <div className="pdfhighcharts hide-chart">
            <HighchartsReact
              containerProps={{
                style: { height: "100%", overflow: "unset" },
              }}
              highcharts={Highcharts}
              options={chartsArray[Index]}
              immutable
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ExportPdfCharts;

async function print() {
  let clientWidth = document.body.clientWidth;
  //let doc = new jsPDF();
  let pdfWidth,
    pdfHeight,
    x,
    y,
    w,
    h,
    baseX,
    baseY,
    sourceX,
    sourceY,
    logoX,
    logoY,
    copyRightX,
    copyRightY,
    qWordBreak,
    lWordBreak;
  const {
    export: { pdfExport },
  } = store.getState();
  let source = document.querySelectorAll(".allpdfhighcharts .highcharts-root");

  let portraitland: any;
  pdfWidth = 300;
  pdfHeight = 220;
  if (clientWidth >= 320) {
    portraitland = "l";
  }
  let doc = new jsPDF(portraitland, "mm", [pdfWidth, pdfHeight]);

  for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
    if (
      pdfExport[sourceIndex]?.payloadData?.chart?.chartType == ChartType.TABLE
    ) {
      if (sourceIndex > 0) {
        doc.addPage();
      }
      pdfWidth = 300;
      pdfHeight = 500;
      x = 5;
      y = 30;
      w = 290;
      h = 140;
      baseX = 12;
      baseY = 190;
      sourceX = 12;
      sourceY = 185;
      logoX = 10;
      logoY = 204;
      copyRightX = 40;
      copyRightY = 210.5;
      lWordBreak = pdfWidth - 20;
      qWordBreak = 180;

      const filledSeries = fillEmptyDateSeries(
        pdfExport[sourceIndex]?.payloadData?.chart?.questionData.type,
        JSON.parse(JSON.stringify(pdfExport[sourceIndex]?.seriesData)),
        pdfExport[sourceIndex]?.payloadData?.chart?.transposed,
        pdfExport[sourceIndex]?.payloadData?.chart?.questionData,
        pdfExport[sourceIndex]?.payloadData?.chart?.bannerQuestionData,
        pdfExport[sourceIndex]?.payloadData?.chart?.chartData
      );
      const chartRows = getChartRows(
        filledSeries,
        pdfExport[sourceIndex]?.payloadData?.chart
      )[0];

      const seriesData = chartRows;
      const output = PdfGenExport(seriesData, "undefined");
      await setDefaultPdfPageProperties(
        doc,
        baseX,
        baseY,
        sourceX,
        sourceY,
        logoX,
        logoY,
        copyRightX,
        copyRightY,
        qWordBreak,
        lWordBreak,
        pdfExport[sourceIndex]?.payloadData
      );
      autoTable(doc, {
        body: output,
        startY: 40,
        styles: { fontSize: 9 },
      });
    } else {
      if (sourceIndex > 0) {
        doc.addPage();
      }
      if (clientWidth >= 320) {
        x = 5;
        y = 30;
        w = 290;
        h = 140;
        baseX = 12;
        baseY = 190;
        sourceX = 12;
        sourceY = 185;
        logoX = 10;
        logoY = 204;
        copyRightX = 40;
        copyRightY = 210.5;
        lWordBreak = pdfWidth - 20;
        qWordBreak = 180;
      }
      let clonedSource: any;
      clonedSource = source[sourceIndex].cloneNode(true) as HTMLElement;
      await setDefaultPdfPageProperties(
        doc,
        baseX,
        baseY,
        sourceX,
        sourceY,
        logoX,
        logoY,
        copyRightX,
        copyRightY,
        qWordBreak,
        lWordBreak,
        pdfExport[sourceIndex]?.payloadData
      );

      await doc.svg(clonedSource, {
        x: x,
        y: y,
        width: w,
        height: h,
        loadExternalStyleSheets: true,
      });
    }
  }

  doc.save(projectName + ".pdf");
}

export const exportPrint = async () => {
  await Promise.all([ExportPdfCharts]).then(() =>
    setTimeout(() => {
      print();
    }, 1000)
  );
};

export const changeChartType = (
  chart: any,
  newChartType: ChartType,
  payloadobject: any
) => {
  const chartDataClone = JSON.parse(JSON.stringify(chart));
  chartDataClone.chartType = newChartType;

  if (newChartType === ChartType.LINE) {
    const lineSetportrait: any = "portrait";
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions["chart"],
        type: "line",
        inverted:
          payloadobject?.chartOrientation === ChartOrientation.LANDSCAPE,
      },
    };
    chartDataClone.chartOptions["plotOptions"] = getPlotOptions(newChartType);
    return chartDataClone;
  } else if (newChartType === ChartType.PIE) {
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions["chart"],
        type: "pie",
      },
    };
    chartDataClone.chartOptions["plotOptions"] = getPlotOptions(newChartType);
    return chartDataClone;
  } else if (newChartType === ChartType.COLUMN) {
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions["chart"],
        type: "column",
        inverted:
          payloadobject?.chartOrientation === ChartOrientation.LANDSCAPE,
      },
    };
    chartDataClone["plotOptions"] = getPlotOptions(newChartType);
    return chartDataClone;
  } else {
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions["chart"],
        type: "column",
        inverted:
          payloadobject?.chartOrientation === ChartOrientation.LANDSCAPE,
      },
    };

    chartDataClone.chartOptions["plotOptions"] = getPlotOptions(newChartType);
    return chartDataClone;
  }
};

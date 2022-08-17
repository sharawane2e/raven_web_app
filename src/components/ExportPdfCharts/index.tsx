import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import jsPDF from 'jspdf';
import { setDefaultPdfPageProperties } from '../../utils/pdf/DefaultPdfProps';
import store from '../../redux/store';
import { ChartType } from '../../enums/ChartType';
import { getChartRows } from '../../utils/table-option-util';
import { PdfGenExport } from '../../utils/pdf/PdfGenExport';
import autoTable from 'jspdf-autotable';
import { projectName } from '../../constants/Variables';
import { getPlotOptions } from '../../utils/ChartOptionFormatter';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { ChartOrientation } from '../../enums/ChartOrientation';

const ExportPdfCharts = (payloadObjectArr: any) => {
  const {
    export: { pdfExport },
  } = store.getState();
  let clientWidth = document.body.clientWidth;

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

  let obj: any;
  let chartsArray: any = [];

  obj = {
    chartOptions: {
      title: {
        text: '',
      },
      chart: {
        type: 'column',
        style: {
          fontFamily: '"Avenir", Arial',
        },
      },
      legend: {
        enabled: true,
        reversed: false,
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span>{point.name}</span>: Count<b> {point.numberValue}, {point.percentageValue:.2f}%</b> of total <b>{point.baseCount}</b><br/>',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        visible: false,
        reversedStacks: false,
      },
      plotOptions: {
        series: {
          pointPadding: 0.04,
          groupPadding: 0.05,
          borderWidth: 0,
          shadow: false,
          dataLabels: {
            enabled: true,
            formatter: function (this: any, options: any) {
              return ` ${parseFloat(this.y.toFixed(2))}${
                ChartLabelType.PERCENTAGE ? '%' : ''
              } <span class="significante-color">${
                this.point.significantDiffernce
                  ? this.point.significantDiffernce
                  : ''
              } </span>`;
            },
            allowOverlap: true,
            rotation: -90,
            align: 'top',
            x: 0,
            y: -6,
            crop: false,
            style: {
              fontSize: '10px',
              textOutline: false,
              fontWeight: null,
            },
          },
        },
        // bar: {
        //   stacking: 'normal',
        // },
      },
      series: [],
    },
  };

  async function print() {
    if (clientWidth >= 1300) {
      pdfWidth = 300;
      pdfHeight = 220;
      // doc = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
      x = 5;
      y = 30;
      w = 290;
      h = 140;
      baseX = 12;
      baseY = 180;
      sourceX = 12;
      sourceY = 185;
      logoX = 10;
      logoY = 195;
      copyRightX = 40;
      copyRightY = 203;
      lWordBreak = pdfWidth - 20;
      qWordBreak = 180;
    } else {
      pdfWidth = 250;
      pdfHeight = 180;
      // doc = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      x = 5;
      y = 30;
      w = 170;
      h = 180;
      baseX = 12;
      baseY = 220;
      sourceX = 12;
      sourceY = 225;
      logoX = 10;
      logoY = 235;
      copyRightX = 40;
      copyRightY = 242;
      lWordBreak = pdfWidth - 20;
      qWordBreak = 160;
    }

    let doc = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);

    let source = document.querySelectorAll(
      '.allpdfhighcharts .highcharts-root',
    );

    for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
      if (
        pdfExport[sourceIndex]?.payloadData?.chart?.chartType != ChartType.TABLE
      ) {
        if (sourceIndex > 0) {
          doc.addPage();
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
          pdfExport[sourceIndex]?.payloadData?.chart,
        );

        await doc.svg(clonedSource, {
          x: x,
          y: y,
          width: w,
          height: h,
          loadExternalStyleSheets: true,
        });
      } else {
        if (sourceIndex > 0) {
          doc.addPage();
        }

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
          pdfExport[sourceIndex]?.payloadData,
        );
        const chartRows = getChartRows(
          pdfExport[sourceIndex]?.seriesData,
          pdfExport[sourceIndex]?.payloadData?.chart,
        )[0];
        const seriesData = chartRows;
        const output = PdfGenExport(seriesData);
        autoTable(doc, {
          body: output,
          startY: 40,
          styles: { fontSize: 6 },
        });
      }
    }
    doc.save(projectName + '.pdf');
  }

  pdfExport.forEach((pdfel: any) => {
    const dataObject = changeChartType(
      obj,
      pdfel?.payloadData?.chart?.chartType,
      pdfel?.payloadData?.chart,
    );
    let newObj = { ...dataObject.chartOptions };
    newObj.series = [];
    newObj?.series.push(...pdfel.seriesData);
    chartsArray.push(newObj);
  });

  return (
    <>
      <div className="allpdfhighcharts">
        <button onClick={() => print()}>Print</button>
        {chartsArray?.map((chart: any, Index: number) => (
          <div className="pdfhighcharts hide-chart">
            <HighchartsReact
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

export const changeChartType = (
  chart: any,
  newChartType: ChartType,
  payloadobject: any,
) => {
  const chartDataClone = JSON.parse(JSON.stringify(chart));
  chartDataClone.chartType = newChartType;

  if (newChartType === ChartType.LINE) {
    const lineSetportrait: any = 'portrait';
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'line',
        inverted:
          payloadobject?.chartOrientation === ChartOrientation.LANDSCAPE,
      },
    };
    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);
    return chartDataClone;
  } else if (newChartType === ChartType.PIE) {
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'pie',
      },
    };
    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);
    return chartDataClone;
  } else if (newChartType === ChartType.COLUMN) {
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'column',
        inverted:
          payloadobject?.chartOrientation === ChartOrientation.LANDSCAPE,
      },
    };
    chartDataClone['plotOptions'] = getPlotOptions(newChartType);
    return chartDataClone;
  } else {
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'column',
        inverted:
          payloadobject?.chartOrientation === ChartOrientation.LANDSCAPE,
      },
    };

    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);
    return chartDataClone;
  }
};

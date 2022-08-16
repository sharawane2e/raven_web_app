import React, { useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "./exportpdf.scss";
import jsPDF from "jspdf";
import { setDefaultPdfPageProperties } from "../../utils/pdf/DefaultPdfProps";
import { getChartOptions } from "../../utils/ChartOptionFormatter";
import { useSelector } from "react-redux";
import { setPdfExport } from "../../redux/actions/exportActions";
import store, { RootState } from "../../redux/store";

const ExportPdfCharts = (payloadObjectArr: any) => {
  const {
    export: { pdfExport },
  } = store.getState();

  //const { dispatch } = store;

  // console.log(
  //   "payloadObjectArr",
  //   typeof payloadObjectArr,
  //   payloadObjectArr.length
  // );

  let obj: any;
  let ReduxCharts: any = pdfExport.flatMap((x) => x);
  let chartsArray: any = [];

  obj = {
    title: {
      text: "",
    },
    chart: {
      type: "column",
      style: {
        fontFamily: '"Avenir", Arial',
      },
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        "<span>{point.name}</span>: Count<b> {point.numberValue}, {point.percentageValue:.2f}%</b> of total <b>{point.baseCount}</b><br/>",
    },
    xAxis: {
      type: "category",
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
          allowOverlap: true,
          align: "top",
          x: 0,
          crop: false,
          style: {
            fontSize: "10px",
            textOutline: false,
            fontWeight: null,
          },
        },
      },
      bar: {
        stacking: "normal",
      },
    },
    series: [],
  };

  //   function createsvg(doc: any, elements: any, index: any) {
  //     return new Promise((res, rej) => {
  //       let clonedSource = elements[index].cloneNode(true) as HTMLElement;
  //       doc.svg(clonedSource, {
  //         x: 5,
  //         y: 30,
  //         width: 290,
  //         height: 140,
  //         loadExternalStyleSheets: true,
  //       });
  //       res(true);
  //     });
  //   }

  // dispatch(setPdfExport(newSeriesData.series));

  // obj.series = newSeriesData.series;

  let sample = [
    {
      name: "Married/Living as married",
      y: 40.67796610169492,
      percentageValue: 40.67796610169492,
      numberValue: 120,
      baseCount: 295,
    },
    {
      name: "Single (widowed, divorced/separated/never married)",
      y: 58.30508474576271,
      percentageValue: 58.30508474576271,
      numberValue: 172,
      baseCount: 295,
    },
    {
      name: "Refused",
      y: 1.0169491525423728,
      percentageValue: 1.0169491525423728,
      numberValue: 3,
      baseCount: 295,
    },
  ];

  // obj.series.push(...pdfExport);
  //   }

  useEffect(() => {
    ReduxCharts.map((x: any, i: any) => {
      obj?.series.push(x);
      console.log("x", x);
      chartsArray.push(obj);
    });
  }, [ReduxCharts]);

  console.log("chartsArray", chartsArray);
  console.log("obj", obj);
  console.log("pdfExport", pdfExport);

  async function print() {
    // const elements: any = document.getElementsByClassName("highcharts-root"); // (2)

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

    if (clientWidth >= 1300) {
      pdfWidth = 300;
      pdfHeight = 220;
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
      pdfWidth = 180;
      pdfHeight = 260;
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

    const doc = new jsPDF("l", "mm", [pdfWidth, pdfHeight]);

    const elements: any = document.getElementsByClassName("highcharts-root"); // (2)

    console.log("elements.length", elements.length);

    for (let k = 0; k < elements.length; k++) {
      //   console.log("obj", obj);

      if (k > 0) {
        doc.addPage();
      }
      let clonedSource: any;

      if (elements.length > 0) {
        clonedSource = elements[k].cloneNode(true) as HTMLElement;
      }

      await doc.svg(clonedSource, {
        x: 5,
        y: 30,
        width: 290,
        height: 140,
        loadExternalStyleSheets: true,
      });
    }

    // for (let k = 0; k < elements.length; k++) {
    //     if (k > 0) {
    //       doc.addPage();
    //     }
    //     let clonedSource = elements[k].cloneNode(true) as HTMLElement;

    //     await doc.svg(clonedSource, {
    //       x: 5,
    //       y: 30,
    //       width: 290,
    //       height: 140,
    //       loadExternalStyleSheets: true,
    //     });
    //   };

    doc.save(`charts.pdf`); // (6)
  }

  //   console.log(obj);

  //   useEffect(() => {
  //     debugger;
  //     //@ts-ignore
  //     let len = document.getElementById("hiddenContainer").length;
  //     console.log(len);
  //     // if (len > 0) {
  //     //@ts-ignore
  //     //   document.getElementById("hiddenContainer")?.innerHTML = (
  //     //     <>
  //     //       <div className="allpdfhighcharts">
  //     //         <button onClick={() => print()}>Print</button>

  //     //         {chartsArray?.map((chart: any) => (
  //     //           <div className="pdfhighcharts">
  //     //             <HighchartsReact
  //     //               containerProps={{
  //     //                 style: {
  //     //                   height: "100%",
  //     //                   overflow: "unset",
  //     //                 },
  //     //               }}
  //     //               highcharts={Highcharts}
  //     //               options={obj}
  //     //               immutable
  //     //             />
  //     //           </div>
  //     //         ))}
  //     //       </div>
  //     //     </>
  //     //   );
  //     // }
  //   }, []);

  return (
    <>
      <div className="allpdfhighcharts">
        <button onClick={() => print()}>Print</button>

        {chartsArray?.map((chart: any, i: any) => (
          <div className="pdfhighcharts hide-chart">
            <HighchartsReact
              containerProps={{
                style: {
                  height: "100%",
                  overflow: "unset",
                },
              }}
              highcharts={Highcharts}
              options={chartsArray[i]}
              immutable
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ExportPdfCharts;

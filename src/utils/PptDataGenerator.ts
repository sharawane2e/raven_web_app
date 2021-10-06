import { decimalPrecision } from "../constants/Variables";

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let lb: any = [];
  let val: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];
  let sortedOptions = options.map((i: any) => {
    return parseInt(i.labelCode, 10);
  });

  sortedOptions.map((item: any) => {
    let cLb = options.find(
      (element: any) => element.labelCode == item.toString()
    );

    lb.push(cLb?.labelText);
  });

  let ChartDataCodeToInt = chartData.map((i: any) => {
    let code = parseInt(i.labelCode);
    let count = i.count;

    return { code, count };
  });
  const sortedCountObj = ChartDataCodeToInt.sort((first: any, second: any) =>
    first.code > second.code ? 1 : -1
  );

  sortedCountObj.map((i: any) => {
    val.push(i.count);
  });
  seriesData = [
    {
      name: questionData?.labelText,
      labels: lb,
      values: val,
    },
  ];

  return seriesData;
}

export function gridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);

  questionData.scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
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

  return seriesData;
}

export function tableChartDataGen(seriesData: any) {
  let row = [];
  // row.push(["", ...seriesData[0].labels]);
  // for (let i = 0; i < seriesData.length; i++) {
  //   row.push([seriesData[i].name, ...seriesData[i].values]);
  // }
  // console.log("row", row);
  debugger;
  let scale: any = [];
  seriesData.map((index: any) => {
    scale.push(index.name);
  });
  row.push(["", ...scale]);
  let a: any = [];
  let b: any = [];
  for (let k = 0; k < seriesData[0].values.length; k++) {
    seriesData.map((d: any) => {
      b.push(d.values[k]);
    });
    a.push([seriesData[0].labels[k], ...b]);
    b = [];
  }
  row.push(...a);
  return row;
}

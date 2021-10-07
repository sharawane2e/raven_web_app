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
  console.log("question data", questionData);
  console.log("chart data", chartData);
  console.log(seriesData);
  return seriesData;
}

export function bannerChartDataGen(
  bannerQuestionList: any,
  questionData: any,
  chartData: any,
  chartOptions: any,
  baseCount: any,
  selectedQuestionId: any,
  selectedBannerQuestionId: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.options.map((label: any) => label.labelText);
  let scale =
    bannerQuestionList.find(
      (ques: any) => ques.qId === selectedBannerQuestionId
    )?.options || [];
  let chartDataComplete = chartData[0];
  scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.options.map((option: any) => {
        if (option.labelCode in chartDataComplete) {
          const obj = chartDataComplete[option.labelCode];
          if (obj != []) {
            const subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (subOptionData) {
              const data = subOptionData.count;
              return data;
              // return data !== undefined
              //   ? +((data / baseCount) * 100).toFixed(decimalPrecision)
              //   : 0;
            } else {
              return 0;
            }
          }
        }
      }),
    });
  });
  return seriesData;
}

export function tableChartDataGen(seriesData: any) {
  let rows = [];
  let scale: any = [];
  seriesData.forEach((index: any) => {
    scale.push(index.name);
  });
  rows.push(["", ...scale]);
  let subRow: any = [];
  for (let k = 0; k < seriesData[0].labels.length; k++) {
    seriesData.forEach((d: any) => {
      if (d.values[k]) {
        subRow.push(d.values[k]);
      } else {
        subRow.push(0);
      }
    });
    rows.push([seriesData[0].labels[k], ...subRow]);
    subRow = [];
  }
  return rows;
}

import _ from 'lodash';
import { mean, median, min, max } from 'simple-statistics';
import { QuestionType } from '../enums/QuestionType';
import store from '../redux/store';
import { IQuestionOption } from '../types/IBaseQuestion';
import { getMatchedfilter } from './Utility';

import { chartDataGen } from './export-helper-utils/ExportChartDataGen';
import { getNumberChartOption } from '../services/ChartNumberService';

export function numberChartTranspose() {
  let seriesData: any;
  // seriesData = getNumberChartOption();
  //console.log('seriesData', seriesData);
  // const { chart, questions } = store.getState();
  // let dataName: any = [];
  // if (!chart?.chartTranspose) {
  //   chart?.chartOptions?.series.forEach((el: any) => {
  //     console.log('el', el);
  //     //dataName?.
  //   });
  // }
  // const { chartData } = chartDataClone;
  // // const allLabels: Array<string> = [];
  // // const newChartData: any = {};
  // // const questionData = chartDataClone.questionData;
  // // const bannerData = chartDataClone.bannerQuestionData;
  // console.log('chartData[0]', chartData);

  // console.log('data set transpose');
  // //debugger;
  // const { chartData } = chartDataClone;
  // const allLabels: Array<string> = [];
  // const newChartData: any = {};
  // const questionData = chartDataClone.questionData;
  // const bannerData = chartDataClone.bannerQuestionData;

  // const subGroups = questionData.options.filter((option: IQuestionOption) => {
  //   const subGroup = [option.labelCode];
  //   if (subGroup && subGroup?.length) return true;
  //   return false;
  // });

  // let optionData = chartData[0];
  // let chartOptionsData: any = [];

  // Object.keys(optionData).forEach(function (key) {
  //   chartOptionsData.push(optionData[key]);
  // });

  // const data: any[] = [];
  // const series: any = [];

  // for (
  //   let index = 0;
  //   index < chartDataClone.questionData?.options.length;
  //   index++
  // ) {
  //   const bannerQuesOption = chartDataClone.bannerQuestionData?.options[index];
  //   // console.log(chartDataClone.questionData.options);

  //   for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
  //     data.push({
  //       name: chartDataClone.bannerQuestionData?.options[quesIndex].labelText,
  //       y: 10,
  //       // baseCount: baseCount,
  //     });
  //   }
  //   //  chartDataClone.chartData = data;
  //   //debugger;
  //   series.push({
  //     // color: primaryBarColor,
  //     name: chartDataClone.questionData.options[index].labelText,
  //     data,
  //     //  dataLabels,
  //   });
  //   chartDataClone.chartData = [series];
  //   console.log('data', series);
  // }

  // chartDataClone.chartData = newChartData;
  // chartDataClone.questionData.scale = newScale;
  // chartDataClone.questionData.subGroups = newSubGroup;
}

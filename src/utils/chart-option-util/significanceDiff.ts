import { ChartLabelType } from '../../enums/ChartLabelType';
import { getCumulativeStdNormalProbability } from '../simplestatistics';
import { indexToChar } from '../Utility';

interface SignificantObject {
  value: any;
  baseCount: any;
}

/* This function get Chart significant Difference*/
export const getsignificantdifference = (series: any, chartLabelType: any) => {
  const seriesName: string[] = [];

  series.forEach((seriesObject: any) => {
    if (seriesObject.data.length > seriesName.length) {
      seriesName.length = 0;
      seriesObject.data.forEach((seriesData: any) => {
        seriesName.push(seriesData.name);
      });
    }
  });

  const updatedSeries = series.map((singleSeries: any) => {
    const updatedSeriesData = {
      ...singleSeries,
      data: singleSeries.data.map((data: any, index: number) => {
        return {
          ...data,
          name: data?.name + `(${indexToChar(seriesName.indexOf(data?.name))})`,
          significance: indexToChar(seriesName.indexOf(data?.name)),
          significantDiffernce: '',
        };
      }),
      dataLabels: {
        ...singleSeries.dataLabels,
        formatter: function (this: any, options: any) {
          return ` ${parseFloat(this.y.toFixed(2))}${
            chartLabelType == ChartLabelType.PERCENTAGE ? '%' : ''
          } <span class="significante-color">${
            this.point.significantDiffernce
          } </span>`;
        },
      },
    };
    return updatedSeriesData;
  });

  updatedSeries.forEach((singleSeries: any, seriesIndex: number) => {
    const seriesdata: any = singleSeries.data;
    //bubble sort
    for (let i = 0; i < seriesdata.length; i++) {
      const significantArry = [];
      for (let j = 0; j < seriesdata.length; j++) {
        const SignificantObject1: SignificantObject = {
          value: seriesdata[i]['percentageValue'],
          baseCount: seriesdata[i]['baseCount'],
        };
        const SignificantObject2: SignificantObject = {
          value: seriesdata[j]['percentageValue'],
          baseCount: seriesdata[j]['baseCount'],
        };

        if (i != j) {
          const isSignificant = significantDifference(
            SignificantObject1,
            SignificantObject2,
          );

          if (isSignificant) {
            significantArry.push(seriesdata[j]['significance']);
          }
        }
      }
      if (significantArry.length) {
        singleSeries.data[i]['significantDiffernce'] =
          '(' + significantArry.join('') + ')';
      }
    }
  });

  return updatedSeries;
};

/* This function get table significant Difference*/
export const getTablesignificantdifference = (seriesData: any) => {
  for (let i = 0; i < seriesData.length; i++) {
    const seriesupdatedLabels = [];
    seriesData[i]['significance'] = [];
    seriesData[i]['significanceDifference'] = [];

    for (let j = 0; j < seriesData[i]['labels'].length; j++) {
      seriesData[i]['significance'].push(indexToChar(j));
      seriesupdatedLabels.push(
        seriesData[i]['labels'][j] + `(${indexToChar(j)})`,
      );
    }
    seriesData[i]['labels'] = seriesupdatedLabels;
  }

  for (let i = 0; i < seriesData.length; i++) {
    for (let j = 0; j < seriesData[i].percentageValues.length; j++) {
      const significantArry = [];

      for (let k = 0; k < seriesData[i].percentageValues.length; k++) {
        if (
          j !== k &&
          seriesData[i].percentageValues[j] != 0 &&
          seriesData[i].percentageValues[k] != 0
        ) {
          const SignificantObject1: SignificantObject = {
            value: seriesData[i].percentageValues[j],
            baseCount: seriesData[i].baseCounts[j],
          };
          const SignificantObject2: SignificantObject = {
            value: seriesData[i].percentageValues[k],
            baseCount: seriesData[i].baseCounts[k],
          };

          const isSignificant = significantDifference(
            SignificantObject1,
            SignificantObject2,
          );

          if (isSignificant) {
            significantArry.push(seriesData[i]['significance'][k]);
          }
        }
      }

      if (significantArry.length) {
        seriesData[i]['significanceDifference'][j] =
          '(' + significantArry.join('') + ')';
      }
    }
  }
  return seriesData;
};

/* This function retun significant  true or false */
const significantDifference = (
  SignificantObject1: SignificantObject,
  SignificantObject2: SignificantObject,
) => {
  const B1 = SignificantObject1.value / 100;
  const B2 = SignificantObject1.baseCount;
  const B4 = SignificantObject2.value / 100;
  const B5 = SignificantObject2.baseCount;

  const poledSampleData = (B1 * B2 + B4 * B5) / (B2 + B5);
  const testStatistic =
    (B1 - B4) /
    Math.sqrt(poledSampleData * (1 - poledSampleData) * (1 / B2 + 1 / B5));

  const result = 2 * (1 - getCumulativeStdNormalProbability(testStatistic));

  if (result < 0.05) {
    return true;
  }

  return false;
};

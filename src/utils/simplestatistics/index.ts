import {
  mean,
  median,
  min,
  max,
  sampleStandardDeviation,
  standardDeviation,
  errorFunction,
  cumulativeStdNormalProbability,
} from 'simple-statistics';
import { round } from '../Utility';

export const getmean = (meanArr: any) => {
  return mean(meanArr);
};

export const getmedian = (medianArr: any) => {
  return median(medianArr);
};

export const getmin = (minArr: any) => {
  return min(minArr);
};
export const getmax = (maxArr: any) => {
  return min(maxArr);
};

export const getsampleStandardDeviation = (
  standardDeviationArr: any,
  precision: any,
) => {
  return standardDeviation(standardDeviationArr).toFixed(precision);
};

export const getStandarderrorFunction = (
  getSampleDeviationValue: any,
  basecount: number,
  precision: number,
) => {
  return round(getSampleDeviationValue, precision) / Math.sqrt(basecount);
};

/*this function return true or false significant difference */
export const getCumulativeStdNormalProbability = (testStatistic: any) =>
  cumulativeStdNormalProbability(testStatistic);
